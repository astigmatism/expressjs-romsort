
var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var FindBestRom = require('./findbestrom.js');
const path = require('path');

module.exports = new (function() {

    var outputFormat = 'jpg';

	this.Exec = function(masterFile, sourcePath, destinationFile, callback) {

        console.log('Looking for existing masterfile to save top suggestions');

        fs.ensureFile(destinationFile, err => {
            if (err) {
                return callback();
            }

            fs.readJson(destinationFile, function(err, originalMasterFile) {
                if (err) {
                    //return callback(err);
                    //dont bail on an error reading the old masterfile, we'll creating it at the end of this cycle
                }

                console.log('Reading masterfile from: ' + masterFile);

                var imagedatafile = {};
                var compress = true; //false for debugging


                //read system data file
                fs.readJson(masterFile, function(err, masterFile) {
                    if (err) {
                        return callback(err);
                    }

                    console.log('Looping over all folders in: ' + sourcePath);

                    //open source folder (web folder used to save images)
                    fs.readdir(sourcePath, function(err, boxartFolders) {
                        if (err) {
                            return callback(err);
                        }

                        //loop over all folders in web box art
                        async.eachSeries(boxartFolders, function(folder, nextfolder) {


                            fs.stat(sourcePath + '/' + folder, function(err, stats) {
                                
                                //bail if a file, folders only
                                if (stats.isFile()) {
                                    return nextfolder(null);
                                }

                                //must have original.jpg
                                fs.exists(sourcePath + '/' + folder + '/original.jpg', function(exists) {

                                    //if the data file has an entry for the web folder. simply having a title in this file marks it as having art
                                    //will can fill the object with data in the future
                                    //update: I write if this art is "top suggestion"
                                    if (folder in masterFile && exists) {
                                        console.log('found image for: ' + folder);
                                        
                                        imagedatafile[folder] = {}; //at the moment, I have no data to put here so we'll simply check for existance

                                        //now check if this was previously a top suggestion and make it one again
                                        if (originalMasterFile && originalMasterFile[folder] && originalMasterFile[folder].t && originalMasterFile[folder].t == 'true') {
                                            imagedatafile[folder].t = 'true';
                                        }
                                    }

                                    nextfolder();
                                });
                            });
                        }, function(err, result) {

                            if (err) {
                                return callback(err);
                            }

                            //write data file
                            fs.writeFile(destinationFile, JSON.stringify(imagedatafile), function(err) {
                                if (err) {
                                    return callback(err);
                                }
                                
                                console.log('Masterfile task complete. result in ' + destinationFile);

                                callback(null, '');
                            });
                        });

                    });
                });
            });
        });
    };
});
