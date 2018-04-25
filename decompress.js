var fs = require('fs-extra');
var async = require('async');
var sevenZip = require('node-7z');
var nodeZip = require('node-zip');
var beep = require('beepbeep');
var Main = require('./main.js');

module.exports = new (function() {

	this.exec = function(system, sourcePath, destinationPath, callback) {

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
						if (err) return nextfile(err);
						

						OnEachExtractedTitle(system, file, function(err, titleObject) {

	
							//is this a file? (also check if 7z?)
							if (stats.isFile() && titleObject.ext === '7z') {
		
								
								var task = new sevenZip();
		
								task.extractFull(sourcePath + '/' + file, destinationPath + '/' + titleObject.name, { 
		
								})
		
								// Equivalent to `on('data', function (files) { // ... });` 
								.progress(function (files) {
									
								})
		
								// When all is done 
								.then(function () {
		
									//add's (U) to all files. I did this for Atari systems where it was true and I wanted to artifically rank them higher than PD
		
									if (titleObject.name !== 'Public Domain') {
		
										fs.readdir(destinationPath + '/' + titleObject.name, function(err, extractedfiles) {
											if (err) return nextfile(err);
											
											//loop over extracted as needed
											async.eachSeries(extractedfiles, function(extractedfile, nextextractedfile) {
												
												OnEachExtractedFile(system, destinationPath, titleObject, extractedfile, function(err) {
													if (err) return nextextractedfile(err);
													return nextextractedfile();
												});
		
											}, function(err, result) {
		
												console.log('decompress 7z: ' + file);
												return nextfile();
											});
										});
									} 
									else {
										console.log('decompress 7z: ' + file);
										return nextfile();
									}
								})
		
								// On error 
								.catch(function (err) {
									return nextfile(err);
								});
		
							} 
							
							//not tested in a while, try again
							else if (stats.isFile() && titleObject.ext === 'zip') {
		
								//read file
								fs.readFile(sourcePath + '/' + file, function(err, buffer) {
									if (err) return nextfile(err);
		
									var zip = new nodeZip(buffer);
									
									//create a target folder
									Main.createFolder(destinationPath + '/' + titleObject.name, true, function(err) {
										if (err) {
											return nextfile(err);
										}
		
										//write zip to dest
										Object.keys(zip.files).forEach(function(filename) {
											var content = zip.files[filename].asNodeBuffer();
											fs.writeFileSync(destinationPath + '/' + titleObject.name + '/' + filename, content);
										});
		
										console.log('decompress zip: ' + file);
		
										return nextfile();
									});
								});
		
							} 
		
							//last I checked, it was broken :P
							// else if (stats.isFile() && titleObject.ext === 'rar') {
		
							// 	//no callback or error checking? weird
							// 	rar.extract(sourcePath + '/' + file, destinationPath + '/' + titleObject.name);
		
							// 	console.log('extracting rar --> ' + file);
		
							// 	return nextfile();
							// }
		
							else {
								//was not a file, keep going
								return nextfile();
							}
						});
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

	var OnEachExtractedTitle = function(system, title, callback) {

		var title = Main.getFileNameAndExt(title);

		//system specific changes (because not all goodsets use the same name formatting)
		switch (system)
		{
			case "nds":
				title.name = title.name.replace(/^(\d{4}|xxxx)\s{1}\-?\s?/,''); //remove prefix for nds
				break;
			case "vect":
				var year = 2000;
				yearmatch = title.name.match(/\((\d{4})\)/);

				if (yearmatch && yearmatch.length > 0) {
					year = yearmatch[1];
				}
				break;
		}

		//all systems - remove everything in paran
		title.name = title.name.replace(/\(.*\)/g,'');
		
		//title.name = title.name.replace(/_/g,' ');
		
		title.name = title.name.trim();

		return callback(null, title);
	};

	var OnEachExtractedFile = function(system, destinationPath, titleObject, file, callback) {
		
		var fname = Main.getFileNameAndExt(file);

		//again, system specific work
		switch (system)
		{
			case "lynx":
				
				fname.name += ' (U)';

				fs.rename(destinationPath + '/' + titleObject.name + '/' + file, destinationPath + '/' + titleObject.name + '/' + fname.name + '.' + fname.ext, function(err) {
					if (err) return callback(err);
					return callback();
				});
				break;
			case "a7800":

				//for atari 7800, a typical file name look like this: "Midnight Mutants (1990) (Atari) (PAL).a78" ... this sucks, no goodtools codes
				
				palmatch = fname.name.match(/\(pal\)/gi);
				if (palmatch) {
					fname.name += ' |E|';
				} 
				else {
					fname.name += ' |U|';
				}
				
				fname.name = fname.name.replace(/\(.*\)/g,'');
				fname.name = fname.name.replace(/\|(.*)\|/g,'($1)');
				fname.name = fname.name.trim();

				fs.rename(destinationPath + '/' + titleObject.name + '/' + file, destinationPath + '/' + titleObject.name + '/' + fname.name + '.' + fname.ext, function(err) {
					if (err) return callback(err);
					return callback();
				});
				break;
			default:
				return callback();
		}
	}
});