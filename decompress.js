var fs = require('fs-extra');
var async = require('async');
var sevenZip = require('node-7z');
var nodeZip = require('node-zip');
var beep = require('beepbeep');
var Main = require('./main.js');

/**
 * DataService Constructor
 */
Decompress = function() {
};

Decompress.exec = function(sourcePath, destinationPath, callback) {

	console.log('Opening ' + sourcePath);

	//open source folder
	fs.readdir(sourcePath, function(err, sevenzipfiles) {
        if (err) {
            return callback(err);
        }

        console.log('Found ' + sevenzipfiles.length + ' titles in ' + sourcePath);

        //create a target folder
        Main.createFolder(destinationPath, true, function(err) {
        	if (err) {
        		return callback(err);
        	}

        	console.log('Created (or overwrote) ' + destinationPath);

			//loop over all file contents
	        async.eachSeries(sevenzipfiles, function(file, nextfile) {

	        	//get file stats
	        	fs.stat(sourcePath + '/' + file, function(err, stats) {
	        		if (err) {
	                	return nextfile(err);
	            	}

	            	var f = Main.getFileNameAndExt(file);


	            	//for nintendo ds
	            	f.name = f.name.replace(/^(\d{4}|xxxx)\s{1}\-?\s?/,''); //remove prefix for nds
	            	
	            	//for vectrex
	            	// var year = 2000;
	            	// yearmatch = f.name.match(/\((\d{4})\)/);

	            	// if (yearmatch && yearmatch.length > 0) {
	            	// 	year = yearmatch[1];
	            	// }
					// end vect

	            	//all systems - remove everything in paran
	            	f.name = f.name.replace(/\(.*\)/g,'');
	            	
	            	//f.name = f.name.replace(/_/g,' ');
	            	
	            	f.name = f.name.trim();


	            	//is this a file? (also check if 7z?)
	            	if (stats.isFile() && f.ext === '7z') {

	            		
						var task = new sevenZip();

						task.extractFull(sourcePath + '/' + file, destinationPath + '/' + f.name, { 

						})

						// Equivalent to `on('data', function (files) { // ... });` 
						.progress(function (files) {
							
						})

						// When all is done 
						.then(function () {

							//add's (U) to all files. I did this for Atari systems where it was true and I wanted to artifically rank them higher than PD

							// if (f.name !== 'Public Domain') {
							// 	fs.readdir(destinationPath + '/' + f.name, function(err, extractedfiles) {
							//         if (err) {
							//             return nextfile(err);
							//         }
							// 		//loop over extracted as needed
							// 		async.eachSeries(extractedfiles, function(extractedfile, nextextractedfile) {


							// 			//for lynx
							// 			var fname = Main.getFileNameAndExt(extractedfile);

							// 			fname.name += ' (U)';

							// 			fs.rename(destinationPath + '/' + f.name + '/' + extractedfile, destinationPath + '/' + f.name + '/' + fname.name + '.' + fname.ext, function(err) {
							// 				if (err) {
							// 					return nextextractedfile(err);
							// 				}

							// 				return nextextractedfile();
							// 			});

							// 		}, function(err, result) {

							// 			console.log('decompress 7z: ' + file);
							// 			return nextfile();
							// 		});
							// 	});
							// } else {
							// 	console.log('decompress 7z: ' + file);
							// 	return nextfile();
							// }
							

							console.log('decompress 7z: ' + file);
							return nextfile();
						})

						// On error 
						.catch(function (err) {
							return nextfile(err);
						});

	            	} 

	            	else if (stats.isFile() && f.ext === 'zip') {

	            		//read file
						fs.readFile(sourcePath + '/' + file, function(err, buffer) {
					        if (err) {
					            return nextfile(err);
					        }

					        var zip = new nodeZip(buffer);
					        
					        //create a target folder
						    Main.createFolder(destinationPath + '/' + f.name, true, function(err) {
						    	if (err) {
						    		return nextfile(err);
						    	}

						        //write zip to dest
						        Object.keys(zip.files).forEach(function(filename) {
									var content = zip.files[filename].asNodeBuffer();
									fs.writeFileSync(destinationPath + '/' + f.name + '/' + filename, content);
								});

								console.log('decompress zip: ' + file);

								return nextfile();
							});
				        });

	            	} 

	            	//last I checked, it was broken :P
	            	// else if (stats.isFile() && f.ext === 'rar') {

	            	// 	//no callback or error checking? weird
	            	// 	rar.extract(sourcePath + '/' + file, destinationPath + '/' + f.name);

	            	// 	console.log('extracting rar --> ' + file);

	            	// 	return nextfile();
	            	// }

	            	else {
	            		//was not a file, keep going
	            		return nextfile();
	            	}
	        	});

	        }, function(err, result) {
	            if (err) {
	                return callback(err);
	            }
	            beep(4);
	            console.log('decompress task complete. results in ' + destinationPath);
	            return callback(null, '');
	        });
        });
    });
};

module.exports = Decompress;