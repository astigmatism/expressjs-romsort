var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
const path = require('path');
var colors = require('colors');

module.exports = new (function() {


	this.Exec = function(sourcePath, workingFolder, folders, callback) {
        
        folders = folders.split(',');

        //for each folder name
        async.eachSeries(folders, function(folder, nextfolder) {
            
            folder = folder.replace(/^\s+|\s+$/gm,''); //trim name
            console.log('Starting ' + folder + '...');

            var folderSourcePath = path.join(sourcePath, folder);

            fs.stat(folderSourcePath, function(err, stats) {
                if (err) {
                    return nextfolder(err);
                }

                if (stats.isDirectory()) {

                    console.log(colors.green('    Clearing working folder...'));

                    //clear working folder
                    Main.emptydir(workingFolder, function(err) {
                        if (err) {
                            return nextfolder(err);
                        }

                        //move files into folders
                        MoveFilesIntoFolders(folderSourcePath, sourcePath, (err) => {
                            if (err) {
                                return nextfolder(err);
                            }

                            console.log(colors.green('    Deleting original folder...'));

                            //delete original folder
                            Main.rmdir(folderSourcePath, (err) => {
                                if (err) {
                                    return nextfolder(err);
                                }   

                                return nextfolder();
                            });
                        });

                    });
                }
                else {
                    return nextfolder(folder + ' is not a folder');
                }
            });

        }, function(err, result) {

            if (err) {
                return callback(err);
            }
            callback();
        });
    };

    var MoveFilesIntoFolders = function(source, destination, callback) {
        
        var datafile = {};

        //open source folder
        fs.readdir(source, function(err, files) {
            if (err) {
                return callback(err);
            }

            console.log(colors.green('    Found ' + files.length + ' file(s) in ' + source));

            //loop over all file contents
            async.eachSeries(files, function(file, nextfile) {

                var sourceFile = path.join(source, file);

                fs.stat(sourceFile, function(err, stats) {
                    
                    //bail if anything but a file
                    if (stats.isFile()) {

                        if (file === '.DS_Store') {
                            return nextfile();
                        }
                            
                        //add to remove year: .replace(/\(\d{2}[a-z0-9]{0,2}\)/g,'')
                        //used for lynx

                        //remove file extenstions, anything in brackets 
                        var dirname = file.replace(/\..{2,3}$/i,''); //remove extensions
                        dirname = dirname.replace(/\(.{1}\)/g,''); //remove periods
                        dirname = dirname.replace(/\[.*\]/g,''); //remove everything in brackets
                        dirname = dirname.replace(/\(\d{2}[a-z0-9]{0,2}\)/g,''); //remove year (1999) or (199x) or (19xx)
                        dirname = dirname.replace(/\s{2,}/g,' '); //remove any double spacing
                        dirname.trim();

                        var destFolder = path.join(destination, dirname);
                        var destFile = path.join(destination, dirname, file);

                        console.log(colors.blue('        Creating new title folder: ' + dirname));

                        //passing false to second param says NOT to overwrite on exist
                        Main.createFolder(destFolder, false, function(err) {
                            if (err) {
                                return nextfile(err);
                            }

                            console.log(colors.magenta('        Moving rom file: ' + file));

                            Main.copyFile(sourceFile, destFile, function(err) {
                                if (err) {
                                    return nextfile(err);
                                }

                                return nextfile();                      
                            });
                        });
                    }
                });

            }, function(err, result) {

                if (err) {
                    return callback(err);
                }
                callback();
            });
        });
    }
});
