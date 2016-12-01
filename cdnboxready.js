var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');

CDNBoxReady = function() {
};

CDNBoxReady.exec = function(datafilePath, sourcePath, destinationPath, callback) {

    var datafile = {};

    //open data file
    //read system data file
    fs.readJson(datafilePath, function(err, datafile) {
        if (err) {
            return callback(err);
        }

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

                //ensure empty
                Main.emptydir(destinationPath, function(err) {
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

                            //if folder also in data file, we keep!
                            if (datafile.hasOwnProperty(folder)) {

                                var key = encodeURIComponent(Main.compress.string(folder));

                                console.log(folder + ' ---> ' + key);

                                //create a target folder
                                Main.createFolder(destinationPath + '/' + key, true, function(err) {
                                    if (err) {
                                        return callback(err);
                                    }

                	                //read title folder
                	                fs.readdir(sourcePath + '/' + folder, function(err, files) {
                	                    if (err) {
                	                        return nextfolder(err);
                	                    }

                                        for (var i = 0; i < files.length; ++i) {

                                            //no need to copy original source image!! only wastes space on cdn. it was used only to create the resized images we DO use
                                            if (files[i] !== 'original.jpg') {
                                                fs.copySync(sourcePath + '/' + folder + '/' + files[i], destinationPath + '/' + key + '/' + files[i]);
                                            }
                                        }

                                        return nextfolder();
                                    });
                                });
                            } else {
                                return nextfolder();
                            }
        				});

        	        }, function(err, result) {

        	            if (err) {
        	                return callback(err);
        	            }
                        callback(null, '');
        	        });
                });
            });
        });
    });
};

module.exports = CDNBoxReady;