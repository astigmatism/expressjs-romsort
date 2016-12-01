var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var FindBestRom = require('./findbestrom.js');

DataFile = function() {
};

DataFile.exec = function(sourcePath, destinationFile, callback) {

    var datafile = {};

	//open source folder
	fs.readdir(sourcePath, function(err, gameFolders) {
        if (err) {
            return callback(err);
        }

        var summary = {};

		//loop over all file contents
        async.eachSeries(gameFolders, function(folder, nextfolder) {

        	fs.stat(sourcePath + '/' + folder, function(err, stats) {
                
                //bail if a file, folders only
                if (stats.isFile()) {
                    return nextfolder(null);
                }

                //create object for title
                datafile[folder] = {
                    best: '',         //key for files object which represents the best file suited for emulation play
                    files: {}
                };

                //read title folder
                fs.readdir(sourcePath + '/' + folder, function(err, files) {
                    if (err) {
                        return nextfolder(err);
                    }

                    //get score!
                    var details = FindBestRom.exec(files);

                    if (summary[details.rank]) {
                        summary[details.rank] = summary[details.rank] + 1
                    } else {
                        summary[details.rank] = 1;
                    }

                    datafile[folder].best = details.game;  //key into files maps which represents the best playable file

                    var file = sourcePath + '/' + folder + '/' + details.game;
                    var f = Main.getFileNameAndExt(file);					    

                    //get rank of each file
                    for (var j = 0; j < files.length; ++j) {
                        var filedetails = FindBestRom.exec([files[j]]);
                        datafile[folder].files[files[j]] = filedetails.rank;
                    }

                    console.log(folder + ' --> ' + details.rank + ' ' + details.game);

                    nextfolder();
                });
			});

        }, function(err, result) {

            if (err) {
                return callback(err);
            }

            fs.writeFile(destinationFile, JSON.stringify(datafile), function(error) {
                if (err) {
                    return callback(err);
                }
                
                console.log('rank summary:');
                console.log(summary);

                console.log('datafile task complete. result in ' + destinationFile);

                callback(null, '');
            });
        });
    });
};

DataFile.boxart = function(datafileSource, boxartSoruce, destinationFile, callback) {

    console.log('reading datafile from: ' + datafileSource);

    var imagedatafile = {};


    //read system data file
    fs.readJson(datafileSource, function(err, datafile) {
        if (err) {
            return callback(err);
        }

        console.log('looping over all folders in: ' + boxartSoruce);

        //open source folder (web folder used to save images)
        fs.readdir(boxartSoruce, function(err, boxartFolders) {
            if (err) {
                return callback(err);
            }

            //loop over all folders in web box art
            async.eachSeries(boxartFolders, function(folder, nextfolder) {

                fs.stat(boxartSoruce + '/' + folder, function(err, stats) {
                    
                    //bail if a file, folders only
                    if (stats.isFile()) {
                        return nextfolder(null);
                    }

                    //if the data file has an entry for the web folder, then we want to mark this game as having art
                    if (datafile.hasOwnProperty(folder)) {
                        console.log('found boxart for: ' + folder);
                        imagedatafile[folder] = true;
                    }

                    nextfolder();
                });
            }, function(err, result) {

                if (err) {
                    return callback(err);
                }

                //write data file
                fs.writeFile(destinationFile, JSON.stringify(imagedatafile), function(error) {
                    if (err) {
                        return callback(err);
                    }
                    
                    console.log('datafile task complete. result in ' + destinationFile);

                    callback(null, '');
                });
            });

        });
    });
};

module.exports = DataFile;