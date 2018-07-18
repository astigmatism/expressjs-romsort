var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var FindBestRom = require('./findbestrom.js');
const path = require('path');

MasterFile = function() {
};

MasterFile.exec = function(system, sourcePath, destinationFile, callback) {

    var masterFile = {};

	//open source folder
	fs.readdir(sourcePath, function(err, gameFolders) {
        if (err) return callback(err);

        var summary = {};

		//loop over all title folders
        async.eachSeries(gameFolders, function(folder, nextfolder) {

        	fs.stat(sourcePath + '/' + folder, function(err, stats) {
                
                //bail if a file, folders only
                if (stats.isFile()) return nextfolder(null);

                //create object for title
                var entry = masterFile[folder] = {
                    b: '',          //b = best. key for files object which represents the best file suited for emulation play
                    f: {}           //f = files
                };

                var titlePath = path.join(sourcePath, folder);

                //read title folder
                fs.readdir(titlePath, function(err, files) {
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

                    entry.b = details.game;  //key into files maps which represents the best playable file

                    var file = sourcePath + '/' + folder + '/' + details.game;
                    var f = Main.getFileNameAndExt(file);					    

                    //build file data
                    for (var j = 0; j < files.length; ++j) {
                        var filedetails = FindBestRom.exec([files[j]]);
                        
                        var gameKey = Main.compress.json([system, folder, files[j]]);

                        entry.f[files[j]] = {
                            rank: parseFloat(filedetails.rank),
                            gk: gameKey
                        }
                    }

                    console.log(folder + ' --> ' + details.rank + ' ' + details.game);

                    nextfolder();
                });
			});

        }, function(err, result) {

            if (err) {
                return callback(err);
            }

            fs.writeFile(destinationFile, JSON.stringify(masterFile), function(error) {
                if (err) {
                    return callback(err);
                }
                
                console.log('rank summary:');
                console.log(summary);

                console.log('masterfile task complete. result in ' + destinationFile);

                callback(null, '');
            });
        });
    });
};

module.exports = MasterFile;