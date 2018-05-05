var fs = require('fs-extra');
var async = require('async');
var pako = require('pako');
var btoa = require('btoa');
var atob = require('atob');
var nodeZip = require('node-zip');
var config = require('config');

/**
 * DataService Constructor
 */
Main = function() {
};

Main.onApplicationStart = function() {

	//ensure all paths exist
	for (path in config.get('paths')) {

		Main.createFolder(__dirname + config.get('paths')[path], false, function(err) {
			if (err) {
				console.log(err);
			}
		});
	};
};

Main.copyAllFiles = function(sourceFolderPath, destinationFolderPath, overrideDestination, copyFolders, callback) {


	//ensuring destination exists, overrides it if needed
    Main.createFolder(destinationFolderPath, overrideDestination, function(err) {
        if (err) {
            return callback(err);
        }

		//open source folder
	    fs.readdir(sourceFolderPath, function(err, files) {
	        if (err) {
	            return callback(err);
	        }

	        //loop over all file contents
	        async.eachSeries(files, function(file, nextfile) {

	            fs.stat(sourceFolderPath + '/' + file, function(err, stats) {
	                if (err) {
	                	return nextfile(err);
	                }

	                //handle file or folder
	                if (stats.isFile()) {

	                	//ugh
	                    if (file === '.DS_Store') {
	                        return nextfile();
	                    }

	                    //copy file to destination
	                    Main.copyFile(sourceFolderPath + '/' + file, destinationFolderPath + '/' + file, function(err) {
	                        if (err) {
	                            return nextfile(err);
	                        }

	                        nextfile();                      
	                    });
	                }
	                else {

	                	//its a folder! are we copying them too?
	                	if (copyFolders) {

	                		Main.copyAllFiles(sourceFolderPath + '/' + file, destinationFolderPath + '/' + file, overrideDestination, copyFolders, function(err) {
	                			if (err) {
	                				return nextfile(err);
	                			}
	                			nextfile();
	                		});

	                	}
	                }
	            });

	        }, function(err, result) {

	            if (err) {
	                return callback(err);
	            }

	            console.log('Copied all files: ' + sourceFolderPath + ' ---> ' + destinationFolderPath);

	            callback(null, '');
	        });
	    });
    });
};

Main.copyFile = function(sourcePath, destinationPath, callback) {

	//read file
    fs.readFile(sourcePath, function(err, buffer) {
        if (err) {
        	console.log(err);
            return callback(err);
        }

        fs.writeFile(destinationPath, buffer, function(err) {
            if (err) {
            	console.log(err);
                return callback(err);
            }

            console.log(sourcePath + ' --- copied ---> ' + destinationPath);

            callback();
        }); 
    });
};

Main.createFolder = function(path, overwrite, callback) {

	fs.exists(path, function (exists) {

		var create = function() {

			fs.mkdir(path, function(err) {
	            if (err) {
	                return callback(err);
	            }

	            return callback(null)
	        });
		};

		if (exists) {

			if (overwrite) {
				Main.rmdir(path, function (err) {
					if (err) {
						return callback(err);
					}
					create();
				});
			} else {
				//exists and do not overwrite
				callback(null);
				return;
			}
		} else {
			//does not exist
			create();
		}
	});
};

Main.getFileNameAndExt = function(pathOrFile) {

	//extract file name and ext
	var m = pathOrFile.match(/([^:\\/]*?)(?:\.([^ :\\/.]*))?$/);
	return {
		name: m[1],
		ext: m[2]
	}
};

Main.rmdir = function(path, callback) {
	fs.readdir(path, function(err, files) {
		if(err) {
			// Pass the error on to callback
			callback(err, []);
			return;
		}
		var wait = files.length,
			count = 0,
			folderDone = function(err) {
			count++;
			// If we cleaned out all the files, continue
			if( count >= wait || err) {
				fs.rmdir(path,callback);
			}
		};
		// Empty directory to bail early
		if(!wait) {
			folderDone();
			return;
		}
		
		// Remove one or more trailing slash to keep from doubling up
		path = path.replace(/\/+$/,"");
		files.forEach(function(file) {
			var curPath = path + "/" + file;
			fs.lstat(curPath, function(err, stats) {
				if( err ) {
					callback(err, []);
					return;
				}
				if( stats.isDirectory() ) {
					Main.rmdir(curPath, folderDone);
				} else {
					fs.unlink(curPath, folderDone);
				}
			});
		});
	});
};

Main.IsDirEmpty = function(path, callback) {

	fs.readdir(path, function(err, files) {
		if (err) {
		   return callback(err);
		} else {
		   if (!files.length) {
			   return callback(null, true);
		   }
		   return callback(null, false);
		}
	});
};

Main.emptydir = function(path, callback) {
	fs.readdir(path, function(err, files) {
		if(err) {
			// Pass the error on to callback
			callback(err, []);
			return;
		}
		var wait = files.length,
			count = 0,
			folderDone = function(err) {
			count++;
			// If we cleaned out all the files, continue
			if( count >= wait || err) {
				callback();
			}
		};
		// Empty directory to bail early
		if(!wait) {
			folderDone();
			return;
		}
		
		// Remove one or more trailing slash to keep from doubling up
		path = path.replace(/\/+$/,"");
		files.forEach(function(file) {
			var curPath = path + "/" + file;
			fs.lstat(curPath, function(err, stats) {
				if( err ) {
					callback(err, []);
					return;
				}
				if( stats.isDirectory() ) {
					Main.rmdir(curPath, folderDone);
				} else {
					fs.unlink(curPath, folderDone);
				}
			});
		});
	});
};

//order: stringify, encode, deflate, unescape, base64
Main.compress = {
    bytearray: function(uint8array) {
        var deflated = pako.deflate(uint8array, {to: 'string'});
        return btoa(deflated);
    },
    json: function(json) {
        var string = JSON.stringify(json);
        var deflate = pako.deflate(string, {to: 'string'});
        var base64 = btoa(deflate);
        return base64;
    },
    string: function(string) {
        var deflate = pako.deflate(string, {to: 'string'});
        var base64 = btoa(deflate);
        return base64;
    },
    gamekey: function(system, title, file) {
        return this.json({
            system: system,
            title: title,
            file: file
        });
    }
};

Main.decompress = {
    bytearray: function(item) {
        var decoded = new Uint8Array(atob(item).split('').map(function(c) {return c.charCodeAt(0);}));
        return pako.inflate(decoded);
    },
    json: function(item) {
        var base64 = atob(item);
        var inflate = pako.inflate(base64, {to: 'string'});
        var json = JSON.parse(inflate);
        return json;
    },
    string: function(item) {
        var base64 = atob(item);
        var inflate = pako.inflate(base64, {to: 'string'});
        return inflate;
    }
};

Main.getPath = function(key) {
	return __dirname + config.get('paths')[key];
};

module.exports = Main;