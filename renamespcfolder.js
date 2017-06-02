var fs = require('fs-extra');
var async = require('async');
var nodeZip = require('node-zip');
var sevenZip = require('node-7z');
var Main = require('./main.js');

RenameSPCFolder = function() {
};

RenameSPCFolder.exec = function(sourcePath, destinationPath, callback) {

	//open source folder
	fs.readdir(sourcePath, function(err, gameFolders) {
        if (err) {
            return callback(err);
        }

		//loop over all file contents
        async.eachSeries(gameFolders, function(folder, nextfolder) {

        	fs.stat(sourcePath + '/' + folder, function(err, stats) {
                if (err) {
                	return nextfolder(err);
                }

                //bail if a file, folders only
                if (stats.isFile()) {
                    return nextfolder();
                }

                var filePath = sourcePath + '/' + folder + '/info.txt';

                fs.exists(filePath, function (exists) {

                	if (exists) {

                		//read info file
		                fs.readFile(filePath, 'utf8', function(err, content) {
		                    if (err) {
		                        return nextfolder(err);
		                    }

		                    var gameName = content.split('\n')[0];

		                    if (gameName) {

		                    	gameName = gameName.replace(/[\\~#%&*{}/:<>?|\"-]/g,'');

		                    	console.log('Found game name for folder "' + folder + '": ' + gameName);

		                    	Main.copyAllFiles(sourcePath + '/' + folder, destinationPath + '/' + gameName, true, true, function(err) {
		                    		if (err) {
						        		return nextfolder(err);
						        	}
						        	return nextfolder();
		                    	});
			                }
			                else {
			                	return nextfolder('Could not find game name');
			                }
		                });

                	}
                });
			});

		}, function(err, result) {
            if (err) {
                return callback(err);
            }
            console.log('rename spc folders task complete. results in ' + destinationPath);
            return callback(null, '');
        });
    });
};

module.exports = RenameSPCFolder;