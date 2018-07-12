var fs = require('fs-extra');
var async = require('async');
var sevenZip = require('node-7z');
var nodeZip = require('node-zip');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');
var colors = require('colors');

module.exports = new (function() {

	var me = this;
	var highRomCountTheshold = 100; //greater than 10 files, alert on completion
	var highRomCountWarning = {};
	var errorInDecompression = {};

	this.Exec = function(system, sourcePath, destinationPath, destinationRoot, callback) {

		console.log('Opening ' + sourcePath);
		highRomCountWarning = {};
		errorInDecompression = {};
	
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
					
					console.log(file7z + ' ...');

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

									fs.readdir(path.join(destinationPath, titleObject.name), (err, romFiles) => {
										
										var count = 0;
										romFiles.forEach(file => {
											count++;
										});

										console.log(colors.green('    file(s) extracted: ' + count));

										if (count > highRomCountTheshold) {
											if (highRomCountWarning[titleObject.name]) {
												highRomCountWarning[titleObject.name] += count;
											}
											else {
												highRomCountWarning[titleObject.name] = count;
											}
											
										}

										return nextfile7z();
									});
								})
								.catch(function (err) {
									console.log('    THERE WAS AN ERROR!');
									errorInDecompression[titleObject.name] = err;
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
						console.log('\nDecompress task complete. results in ' + destinationPath + '\n');
						console.log('these titles have a high rom count, perhaps use rom folders?', colors.blue(highRomCountWarning));
						console.log('these titles errored:', colors.red(errorInDecompression));
						return callback(null, highRomCountWarning);
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

				var titlePath = path.join(destinationPath, title);

				fs.stat(titlePath, (err, stats) => {
					if (err) return nexttitle(err);
					
					//bail if a file, folders only in here
					if (stats.isFile()) return nexttitle();

					console.log('title scan: ' + title);

					//open title folder
					fs.readdir(titlePath, function(err, files) {
						if (err) return callback(err);
						
						//loop over all files
						async.eachSeries(files, function(file, nextfile) {
							
							OnEachExtractedFile(system, destinationRoot, destinationPath, title, file, function(err) {
								if (err) return nextfile(err);
								return nextfile();
							});
			
						}, function(err) {
							if (err) return nexttitle(err);

							//at this point, check if the title folder is empty. It's possible from the OnEachExtractedFile step (gb to gbc folder will leave title folders empty)
							Main.IsDirEmpty(titlePath, function(err, result) {
								if (err) return nexttitle(err);

								if (result) {
									fs.removeSync(titlePath);
									return nexttitle();
								}
								return nexttitle();

							});
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
			case 'arcade':

				//open mame.dat file converted from xml to json (using an online tool)
				fs.readJson('./tools/mame.json', (err, mamedat) => {
					if (err) return callback(err);

					for (var i = 0; i < mamedat.datafile.game.length; ++i) {

						var game = mamedat.datafile.game[i];
						if (game['-name'] === title) {
							console.log(file);
						}
					}
				});

				break;
			case "gb":
				//operation separate gbc!
				gbcmatch = (fname.ext === 'gbc');

				if (gbcmatch) {
					
					//create gbc folder (dont override it, just ensure its there)
					Main.createFolder(path.join(destinationRoot, 'gbc'), false, function(err) {
						if (err) return callback(err);

						//create title folder, again dont override
						Main.createFolder(path.join(destinationRoot, 'gbc', title), false, function(err) {
							if (err) return callback(err);
						
							//move this file over
							fs.rename(path.join(destinationPath, title, file), path.join(destinationRoot, 'gbc', title, file), function(err) {
								if (err) return callback(err);
								return callback();
							});
						});
					});
				}
				else {
					return callback();
				}

				break;
			case "jag":
			case "lynx":
				
				if (title !== 'Public Domain') {
					fname.name += ' (U)';
				}

				fs.rename(destinationPath + '/' + title + '/' + file, destinationPath + '/' + title + '/' + fname.name + '.' + fname.ext, function(err) {
					if (err) return callback(err);
					return callback();
				});
				break;
			case "a7800":

				//for atari 7800, a typical file name look like this: "Midnight Mutants (1990) (Atari) (PAL).a78" ... this sucks, no goodtools codes
				
				if (title === 'Public Domain') {
					fname.name += ' |PD|';
				} else {

					palmatch = fname.name.match(/\(pal\)/gi);
					if (palmatch) {
						fname.name += ' |E|';
					} 
					else {
						fname.name += ' |U|';
					}
				}
				
				fname.name = fname.name.replace(/\(.*\)/g,'');
				fname.name = fname.name.replace(/\|([A-Z]+)\|/g,'($1)');
				fname.name = fname.name.trim();

				fs.rename(destinationPath + '/' + title + '/' + file, destinationPath + '/' + title + '/' + fname.name + '.' + fname.ext, function(err) {
					if (err) return callback(err);
					return callback();
				});
				break;
			case "a2600":

				//similar to a7800 but different enough :P

				palmatch = fname.name.match(/\(pal\)/gi);
				if (palmatch) {
					fname.name += ' |E|';
				} 
				else {
					fname.name += ' |U|';
				}

				fname.name = fname.name.replace(/\(.*\)/g,'');
				fname.name = fname.name.replace(/\|([A-Z]+)\|/g,'($1)');
				fname.name = fname.name.trim();

				fs.rename(destinationPath + '/' + title + '/' + file, destinationPath + '/' + title + '/' + fname.name + '.' + fname.ext, function(err) {
					if (err) return callback(err);
					return callback();
				});

				break;
			case "vect":
				
				if (title !== 'Public Domain') {
					fname.name += ' (U)';
				}

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