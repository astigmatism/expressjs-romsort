var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var gm = require('gm');

CDNBoxReady = function() {
};

CDNBoxReady.resizes = [170, 120, 50];
CDNBoxReady.outputFormat = 'jpg';

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

                                //an original.jpg file MUST exist
                                fs.exists(sourcePath + '/' + folder + '/original.jpg', function(exists) {

                                    if (exists) {

                                        //create a target folder
                                        Main.createFolder(destinationPath + '/' + key, true, function(err) {
                                            if (err) {
                                                return callback(err);
                                            }


                                            //now create thumbnails
                                            self.resize(sourcePath + '/' + folder + '/original.jpg', destinationPath + '/' + key, function(err) {
                                                
                                                //on error for thumbnails, break... we require them for packing cdn art
                                                if (err) {
                                                    console.log('Error preparing thumbnails for ' + folder + ': ' + err);
                                                    return callback(err);

                                                } else {

                                                    console.log('All thumbnails created! --> ' + folder);

                                                    return nextfolder();
                                                }
                                            }); 
                                        });

                                    } else {
                                        console.log('Could not find original.jpg in + ' + sourcePath + '/' + folder);
                                        return nextfolder();
                                    }

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

CDNBoxReady.resize = function(source, destination, callback) {

    var self = this;

    //loop over resizes
    async.eachSeries(self.resizes, function(resize, nextresize) {

        gm(source).resize(resize).setFormat(self.outputFormat).write(destination + '/' + resize + '.' + self.outputFormat, function (err) {
            if (err) {
                return nextresize(err)
            }

            console.log(resize + ' resize compelte');
            return nextresize();
        });

    }, function(err) {
        if (err) {
                
            console.log('error in resizes: ' + err);

            callback(true);
            return;
            
        } else {
            callback();
        }
    });
};

module.exports = CDNBoxReady;