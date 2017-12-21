'use strict';
const fs = require('fs-extra');
const async = require('async');
const nodeZip = require('node-zip');
const Main = require('./main.js');
const path = require('path');

/*
filter struct
0: all rom files
1: verified files only (have the [!] flag on them)
2: verified files in base folder with all others in a sub folder
*/

module.exports = new (function() {

    const _self = this;

    this.Exec = function(sourcePath, destinationPath, compressiontype, filter, callback) {
		
		filter = parseInt(filter, 10) || 0;

		//open source folder
		fs.readdir(sourcePath, (err, titleFolders) => {
			if (err) return callback(err);

			//create a target folder
			Main.createFolder(destinationPath, true, (err) => {
				if (err) return callback(err);

				//loop over all file contents
				async.eachSeries(titleFolders, (folder, nextfolder) => {

					var _sourceTitleFolder = path.join(sourcePath, folder);
					var _destinationTitleFolder = path.join(destinationPath, folder);

					fs.stat(_sourceTitleFolder, (err, stats) => {
						if (err) return nextfolder(err);
						
						//bail if a file, folders only in here
						if (stats.isFile()) return nextfolder(null);

						//read title folder
						fs.readdir(_sourceTitleFolder, (err, files) => {
							if (err) return nextfolder(err);

							//create title folder on destination (override)
							Main.createFolder(_destinationTitleFolder, true, (err) => {
								if (err) return nextfolder(err);

								//loop over files
								async.eachSeries(files, function(file, nextfile) {

									var _destinationFolder = _destinationTitleFolder;
									
									HandleFilter(file, filter, _destinationFolder, (err, proceed, newDestination) => {
										if (err) return nextfile(err);
										if (!proceed) return nextfile();

										if (newDestination) {
											_destinationFolder = newDestination;
										}

										var _sourceFile = path.join(sourcePath, folder, file);
										var parsedPath = path.parse(file);

										switch(compressiontype) {
											case 'zip':

												var _destinationFile = path.join(_destinationFolder, parsedPath.name + '.zip');
												Zip(_sourceFile, _destinationFile, (err) => {
													if (err) return nextfile(err);
													return nextfile();
												});
												break;
											case '7z':
												//this was broken the last I tired. Not sure I'll use
											default:
												var _destinationFile = path.join(_destinationFolder, file);
												NoCompression(_sourceFile, _destinationFile , (err) => {
													if (err) return nextfile(err);
													return nextfile();
												});
												break;
										}
										
									});

								}, function(err, result) {
									return nextfolder(err);
									nextfolder();
								});
							});
						});
					});

				}, function(err, result) {
					if (err) return callback(err);
					console.log('Compress files task complete. results in ' + destinationPath);
					return callback(null, 'Complete');
				});
			});
		});
	};

	var HandleFilter = function(file, filter, destinationTitleFolder, callback) {

		var parsedPath = path.parse(file);

		switch(filter) {
			case 1: //verified only
				if (parsedPath.name.match(/\[!\]/gi)) {
					return callback(null, true);
				}
				else {
					return callback(null, false);
				}
				break;
			case 2: //verified in base folder, all others in sub folder
				if (parsedPath.name.match(/\[!\]/gi)) {
					return callback(null, true);
				}
				else {

					var subfolder = path.join(destinationTitleFolder, 'Ω');
					Main.createFolder(subfolder, false, (err) => {
						if (err) return callback(err);
						return callback(null, true, subfolder);
					});
				}
				break;
			default:
				return callback(null, true);
				break;
		}

	};

	var Zip = function(source, destination, callback) {

		var parsedPath = path.parse(source);

		fs.readFile(source, (err, buffer) => {
			if (err) return callback(err);

			var zip = new nodeZip;
			zip.file(source, buffer);
			var options = {base64: false, compression:'DEFLATE'};

			//write zip to dest
			fs.writeFile(destination, zip.generate(options), 'binary', (err) => {
				if (err) return callback(err);

				console.log('compressing zip --> ' + parsedPath.name);
				return callback();
			});
		});
	};

	var SevenZip = function(source, destination, callback) {

		var archive = new sevenZip();
		archive.add(destination, source, {
			m0: '=BCJ',
			m1: '=LZMA:d=21'
		})

		// When all is done 
		.then(function () {
			console.log('compressing 7z --> ' + source);
			return callback();
		})

		// On error 
		.catch(function (err) {
			return callback(err);
		});
	}
	  
	var NoCompression = function(source, destination, callback) {

		fs.copy(source, destination, (err) => {
			if (err) return callback(err);
			console.log('copying file --> ' + source);
			return callback(err);
		})
	};
    
})();
