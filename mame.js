var fs = require('fs-extra');
var async = require('async');
var sevenZip = require('node-7z');
var nodeZip = require('node-zip');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');

module.exports = new (function() {

    var self = this;
    var _mameFile = 'mame0.37b5.json';

	this.Exec = function(sourcePath, destinationPath, callback) {

        Main.emptydir(destinationPath, (err) => {
            if (err) return callback(err);

            console.log('Emptied ' + destinationPath);

            //open the mamedat file
            fs.readJson('./tools/' + _mameFile, (err, mamedat) => {
                if (err) console.error(err)

                console.log(mamedat);

                console.log('Opened mame.json file sucessfully.');
        
                //open source folder
                fs.readdir(sourcePath, function(err, mamefiles) {
                    if (err) return callback(err);
            
                    console.log('Found ' + mamefiles.length + ' mame files in ' + sourcePath);

                    //loop over all file contents
                    async.eachSeries(mamefiles, function(mamefile, nextmamefile) {

                        var file = Main.getFileNameAndExt(mamefile);
                        process.stdout.write(file.name + ' -> ');
                            
                        //for each name in the dat file
                        gamedat = FindInDat(mamedat, file.name);

                        if (gamedat == null) {
                            console.log('error: could not find ' + file.name + ' in dat file');
                            return nextmamefile();
                        }


                        var title = gamedat['description'];

                        process.stdout.write('found in dat as "' + title + '" -> ');

                        //if a clone, put result in clone folder
                        var titleFolder = title;
                        if (gamedat['-cloneof']) {
                            process.stdout.write('is a clone. ');
                            var clonedat = FindInDat(mamedat, gamedat['-cloneof']);
                            titleFolder = clonedat['description'];
                        }
                        else {
                            //if not a clone, spoof the "findbestrom" by adding a GoodTools code to the file name ;)
                            file.name += ' (W)';
                        }
                        
                        //replace illegal characters (copy and paste these, it works!! lol)
                        /*
                        Instead of forward slash / - you can use a division symbol ∕

                        Instead of Colon : - you can use the modifier letter colon ꞉
                        */
                        titleFolder = titleFolder.replace(':','꞉').replace(/\(.*\)/gi, '').replace(/\//g,'∕');

                        //create a target folder (dont overwrite in case we write to cloned)
                        Main.createFolder(path.join(destinationPath, titleFolder), false, function(err) {
                            if (err) {
                                return callback(err);
                            }

                            process.stdout.write('wrote to "' + titleFolder + '" -> ');

                            //copy rom file to that folder
                            fs.copy(path.join(sourcePath, mamefile), path.join(destinationPath, titleFolder, file.name + '.' + file.ext), (err) => {
                                if (err) return callback(err);

                                process.stdout.write('file copied -> complete! \n');

                                return nextmamefile();
                            });
                        });
                    });

                }, function(err, result) {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                });
            });
        });
    }
    
    var FindInDat = function(mamedat, name) {

        for (var i = 0; i < mamedat.datafile.game.length; ++i) {

            if (mamedat.datafile.game[i]['-name'] === name) {
                return mamedat.datafile.game[i];
            }
        }
        return null;
    }
});