var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var FindBestRom = require('./findbestrom.js');

TopChoice = function() {
};

TopChoice.exec = function(sourcePath, destinationPath, flatten, callback) {

    var datafile = {};

	//open source folder
	fs.readdir(sourcePath, function(err, gameFolders) {
        if (err) {
            return callback(err);
        }

        //create a target folder
        Main.createFolder(destinationPath, true, function(err) {
        	if (err) {
        		return callback(err);
        	}

			//loop over all file contents
	        async.eachSeries(gameFolders, function(folder, nextfolder) {

	        	fs.stat(sourcePath + '/' + folder, function(err, stats) {
	                
	                //bail if a file, folders only
	                if (stats.isFile()) {
	                    return nextfolder(null);
	                }

	                //read title folder
	                fs.readdir(sourcePath + '/' + folder, function(err, files) {
	                    if (err) {
	                        return nextfolder(err);
	                    }

	                    var details = FindBestRom.exec(files); //function copied directly from crazyerics project

	                    var file = sourcePath + '/' + folder + '/' + details.game;

                        var writeRomFile = function(dest) {

                            //read file
                            fs.readFile(file, function(err, buffer) {
                                if (err) {
                                    return callback(err);
                                }

                                fs.writeFile(dest, buffer, function(err) {
                                    if (err) {
                                        return nextfolder(err);
                                    }

                                    console.log('topchoice: ' + folder + ' --> ' + details.rank + ' ' + details.game);

                                    return nextfolder();
                                }); 
                            });

                        };

                        //if not flattening file structure, this means we'll put top choice in a title folder (like crazyerics.com expects from CDN)
                        if (!flatten) {

                            Main.createFolder(destinationPath + '/' + folder, true, function(err) {
                                if (err) {
                                    return callback(err);
                                }
                                writeRomFile(destinationPath + '/' + folder + '/' + details.game);
                            });
                        } else {
                            writeRomFile(destinationPath + '/' + details.game);
                        }					    
	                });
				});

	        }, function(err, result) {

	            if (err) {
	                return callback(err);
	            }
                callback(null, '');
	        });
        });
    });

};

module.exports = TopChoice;