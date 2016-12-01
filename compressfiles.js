var fs = require('fs-extra');
var async = require('async');
var nodeZip = require('node-zip');
var sevenZip = require('node-7z');
var Main = require('./main.js');

CompressFiles = function() {
};

CompressFiles.exec = function(sourcePath, destinationPath, compressiontype, filter, callback) {

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

	                //read rom folder
	                fs.readdir(sourcePath + '/' + folder, function(err, files) {
	                    if (err) {
	                        return nextfolder(err);
	                    }

	                    //create rom folder on destination
	                    Main.createFolder(destinationPath + '/' + folder, true, function(err) {
				        	if (err) {
				        		return nextfolder(err);
				        	}

				        	//loop over files
	                        async.eachSeries(files, function(file, nextfile) {

	                        	var f = Main.getFileNameAndExt(file);

	                        	//consider file filters
	                        	if (filter) {

	                        		switch(filter) {
	                        			case 'verified':
	                        				//if "[!]" found in title, is a verified game
									    	if (f.name.match(/\[!\]/gi)) {

									    	} else {
									    		//if not verified, next file
									    		if (f.name.match(/\(PD\)/gi)) {
									    		
									    		} else {
									    			return nextfile();
									    		}
									    	}
	                        				break;
	                        			default:
	                        				break;
	                        		}

	                        	}

	                        	if (compressiontype ===  'zip') {

		                        	//read file
									fs.readFile(sourcePath + '/' + folder + '/' + file, function(err, buffer) {
								        if (err) {
								            return callback(err);
								        }

								        var zip = new nodeZip;
								        zip.file(file, buffer);
								        var options = {base64: false, compression:'DEFLATE'};

								        //write zip to dest
								        fs.writeFile(destinationPath + '/' + folder + '/' + f.name + '.zip', zip.generate(options), 'binary', function(err) {
								            if (err) {
								                return nextfile(err);
								            }
								            console.log('compressing ' + compressiontype + ' --> ' + file);
								            return nextfile(null);
								        });
								    });
								}

								else if (compressiontype === '7z') {

									var archive = new sevenZip();
									archive.add(destinationPath + '/' + folder + '/' + f.name + '.7z', sourcePath + '/' + folder + '/' + file, {
										m0: '=BCJ',
										m1: '=LZMA:d=21'
									})

									// When all is done 
									.then(function () {
										console.log('compressing ' + compressiontype + ' --> ' + file);
										return nextfile();
									})

									// On error 
									.catch(function (err) {
										return nextfile(err);
									});
								}

								//no compression!
								else {

									fs.copy(sourcePath + '/' + folder + '/' + file, destinationPath + '/' + folder + '/' + file, function (err) {
										if (err) {
								            return callback(err);
								        }
								        console.log('copying file --> ' + file);
										return nextfile(null);
									})
								}

	                        }, function(err, result) {
	                            if (err) {
	                                return nextfile(err);
	                            }
	                            nextfolder(null);
	                        });
				       	});
	                });
				});

			}, function(err, result) {
	            if (err) {
	                return callback(err);
	            }
	            console.log('compress files task complete. results in ' + destinationPath);
	            return callback(null, '');
	        });
        });
    });
};

module.exports = CompressFiles;