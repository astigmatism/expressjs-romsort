var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');

AlphaSort = function() {
};

AlphaSort.exec = function(sourcePath, destinationPath, callback) {

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

        	var alpha = '';
        	var count = 0;
        	
        	var letterstep = 2; //a-b, c-d
        	var currentstep = 2;
        	var currentletter = ''
        	var foldertocopyto = '';

			//loop over all file contents
	        async.eachSeries(gameFolders, function(folder, nextfolder) {

	        	fs.stat(sourcePath + '/' + folder, function(err, stats) {
	                
		            //bail if a file, folders only
		            if (stats.isFile()) {
		                return nextfolder();
		            }

		        	if (folder.charAt(0) !== alpha) {
		        		console.log(alpha + ': ' + count);

		        		alpha = folder.charAt(0);
		        		count = 0;

		        	}

		        	//alpha
	        		if ((alpha.charCodeAt(0) >= 65 && alpha.charCodeAt(0) <= 90) || (alpha.charCodeAt(0) >= 97 && alpha.charCodeAt(0) <= 122)) {

	        			var letter = folder.charAt(0).toLowerCase();

	        			var copyFile = function() {

	        				console.log('copying to ' + foldertocopyto + ' --> ' + folder);

	        				//copy game folder to sort folder
	        				fs.copy(sourcePath + '/' + folder, destinationPath + '/' + foldertocopyto + '/' + folder, function (err) {
								if (err) {
	        						return nextfolder(err);
	        					}		

	        					//sort out "hack" games in sorted folder
	        					AlphaSort.sortHacks(destinationPath + '/' + foldertocopyto + '/' + folder, function(err) {
	        						if (err) {
	        							return nextfolder(err);
	        						}
	        						count++;
		        					return nextfolder();
	        					});
							});
	        			};

	        			if (letter !== currentletter) {

	        				++currentstep;

	        				currentletter = letter;

	        				if (currentstep >= letterstep) {
		        				
	        					currentstep = 0;

		        				var charcode = letter.charCodeAt(0);
		        				var nextcharcode = letter.charCodeAt(0) + letterstep - 1;

		        				foldertocopyto = letter.toUpperCase() + '-' + String.fromCharCode(nextcharcode).toUpperCase();

		        				Main.createFolder(destinationPath + '/' + foldertocopyto, false, function(err) {
			        				if (err) {
			        					return nextfolder(err);
			        				}

			        				return copyFile();

			        			});
			        		} else {
			        			//we have not the letter step yet (in A-B, this would be a B title)
			        			return copyFile();
			        		}
	        			} else {
	        				return copyFile();
	        			}

	        		} else {
	        			
	        			//game begins with non-alpha character - put these in the 0-9 folder

	        			Main.createFolder(destinationPath + '/0-9', false, function(err) {
	        				if (err) {
	        					return nextfolder(err);
	        				}

	        				console.log('copying to 0-9 --> ' + folder);

	        				//copy game folder to sort folder
	        				fs.copy(sourcePath + '/' + folder, destinationPath + '/0-9/' + folder, function (err) {
								if (err) {
	        						return nextfolder(err);
	        					}		

	        					//sort out "hack" games in sorted folder
	        					AlphaSort.sortHacks(destinationPath + '/0-9/' + folder, function(err) {
	        						if (err) {
	        							nextfolder(err);
	        						}
	        						count++;
		        					return nextfolder();
	        					});
							});
	        			});
	        		}
	        	});	

			}, function(err, result) {
	            
				console.log(alpha + ': ' + count);

	            if (err) {
	                return callback(err);
	            }

	            console.log('alpha sort task complete. results in ' + destinationPath);

	            return callback();
	        });
        });
    });
};

AlphaSort.sortHacks = function(path, callback) {

	fs.readdir(path, function(err, files) {
        if (err) {
            return callback(err);
        }

		//loop over files
	    async.eachSeries(files, function(file, nextfile) {

	    	var f = Main.getFileNameAndExt(file);
	    	
	    	//if "hack" found in title
	    	if (f.name.match(/hack/gi)) {

	    		//create hack folder and move file into it
	    		Main.createFolder(path + '/Hacks', false, function(err) {
	    			if (err) {
	    				return nextfile(err);
	    			}

	    			console.log('moving hack --> ' + file);

	    			fs.move(path + '/' + file, path + '/Hacks/' + file, function (err) {
						if (err) {
							return nextfile(err)
						}
					  	nextfile();
					});
	    		});
	    	} else {
	    		return nextfile();
	    	}

	    }, function(err, result) {
	        if (err) {
	            return nextfile(err);
	        }
	        callback();
	    });
	});
};


module.exports = AlphaSort;