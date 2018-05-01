var fs = require('fs-extra');
var async = require('async');
var sevenZip = require('node-7z');
var nodeZip = require('node-zip');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');

module.exports = new (function() {

	var me = this;

	this.Exec = function(system, sourcePath, destinationPath, destinationRoot, callback) {

		console.log('Opening ' + sourcePath);
	
		//open source folder
		fs.readdir(sourcePath, function(err, sevenzipfiles) {
			if (err) return callback(err);
	
			console.log('Found ' + sevenzipfiles.length + ' titles in ' + sourcePath);
	
			//create a target folder
			Main.createFolder(destinationPath, true, function(err) {
				if (err) return callback(err);
	
				console.log('Created (or overwrote) ' + destinationPath);
	
				//loop over all file contents
				async.eachSeries(sevenzipfiles, function(file7z, nextfile7z) {
	
					//get file stats
					fs.stat(path.join(sourcePath, file7z), function(err, stats) {
						if (err) return nextfile7z(err);
						

						BuildTitleFolderName(system, file7z, function(err, titleObject) {

	
							// 7z -----------------------
							if (stats.isFile() && titleObject.ext === '7z') {
		
								
								var task = new sevenZip();
		
								task.extractFull(path.join(sourcePath, file7z), path.join(destinationPath, titleObject.name), { 
								})
								.progress(function (files) {	
								})
								.then(function () {
									console.log('decompressed 7z: ' + file7z);
									return nextfile7z();
								})
								.catch(function (err) {
									return nextfile7z(err);
								});
		
							} 
							
							//TODO: ZIP ---------------- not tested in a while, try again
							else if (stats.isFile() && titleObject.ext === 'zip') {
		
								//read file
								fs.readFile(path.join(sourcePath, file7z), function(err, buffer) {
									if (err) return nextfile7z(err);
		
									var zip = new nodeZip(buffer);
									
									//create a target folder
									Main.createFolder(path.join(destinationPath, titleObject.name), true, function(err) {
										if (err) return nextfile7z(err);
		
										//write zip to dest
										Object.keys(zip.files).forEach(function(filename) {
											var content = zip.files[filename].asNodeBuffer();
											fs.writeFileSync(path.join(destinationPath, titleObject.name, filename), content);
										});
		
										console.log('decompress zip: ' + file7z);
		
										return nextfile7z();
									});
								});
		
							} 
		
							//last I checked, it was broken :P
							// else if (stats.isFile() && titleObject.ext === 'rar') {
		
							// 	//no callback or error checking? weird
							// 	rar.extract(sourcePath + '/' + file, destinationPath + '/' + titleObject.name);
		
							// 	console.log('extracting rar --> ' + file);
		
							// 	return nextfile7z();
							// }
		
							else {
								//was not a file, keep going
								return nextfile7z();
							}
						});
					});
	
				}, function(err, result) {
					if (err) {
						return callback(err);
					}

					//scan all decompressed title folders to make changes if needed
					me.ProcessTitles(system, destinationPath, destinationRoot, function(err) {
						if (err) return callback(err);
						
						beep(4);
						console.log('decompress task complete. results in ' + destinationPath);
						return callback();
					});
				});
			});
		});
	};

	this.ProcessTitles = function(system, destinationPath, destinationRoot, callback) {

		//open decompression folder
		fs.readdir(destinationPath, function(err, titles) {
			if (err) return callback(err);

			//loop over all title folders
			async.eachSeries(titles, function(title, nexttitle) {

				fs.stat(path.join(destinationPath, title), (err, stats) => {
					if (err) return nexttitle(err);
					
					//bail if a file, folders only in here
					if (stats.isFile()) return nexttitle();

					console.log('title scan: ' + title);

					//open title folder
					fs.readdir(destinationPath + '/' + title, function(err, files) {
						if (err) return callback(err);
						
						//loop over all files
						async.eachSeries(files, function(file, nextfile) {
							
							OnEachExtractedFile(system, destinationRoot, destinationPath, title, file, function(err, gotoNextTitle) {
								if (err) return nextfile(err);
								if (gotoNextTitle) return nexttitle();
								return nextfile();
							});
			
						}, function(err) {
							if (err) return nexttitle(err);
							return nexttitle();
						});
					});
				});

			}, function(err, result) {
				if (err) return callback(err);
				console.log('title and file scan task complete. results in ' + destinationPath);
				return callback();
			});
		});
	};

	var BuildTitleFolderName = function(system, title, callback) {

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

	var OnEachExtractedFile = function(system, destinationRoot, destinationPath, title, file, callback) {
		
		var fname = Main.getFileNameAndExt(file);

		//again, system specific work
		switch (system)
		{
			case "gb":
				//operation separate gbc!
				gbcmatch = fname.name.match(/\[C\]/gi);

				if (gbcmatch) {
					
					//create gbc folder (dont override it, just ensure its there)
					Main.createFolder(path.join(destinationRoot, 'gbc'), false, function(err) {
						if (err) return callback(err);
						
						//move the entire title folder over. rename WILL overwrite
						fs.rename(path.join(destinationPath, title), path.join(destinationRoot, 'gbc', title), function(err) {
							if (err) return callback(err);
							return callback(null, true);
						});
					});
				}
				else {
					return callback();
				}

				break;
			case "lynx":
				
				fname.name += ' (U)';

				fs.rename(destinationPath + '/' + title + '/' + file, destinationPath + '/' + title + '/' + fname.name + '.' + fname.ext, function(err) {
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

				fs.rename(destinationPath + '/' + title + '/' + file, destinationPath + '/' + title + '/' + fname.name + '.' + fname.ext, function(err) {
					if (err) return callback(err);
					return callback();
				});
				break;
			default:
				return callback();
		}
	}
});