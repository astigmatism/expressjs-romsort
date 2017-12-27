var fs = require('fs-extra');
var async = require('async');
var sevenZip = require('node-7z');
var nodeZip = require('node-zip');
var beep = require('beepbeep');
var Main = require('./main.js');
var CompressShaders = require('./compressshaders');
const path = require('path');

/**
 * DataService Constructor
 */
MakeAllShaders = function() {
};

MakeAllShaders.exec = function(sourcePath, destinationPath, cdnShaderReady, callback) {

    MakeAllShaders.treeNode(sourcePath, destinationPath, cdnShaderReady, {}, function(err, data) {
        if (err) {
            return callback(err);
        }

        console.log(data);

        return callback(null, data);
    });
};

MakeAllShaders.treeNode = function(sourcePath, destinationPath, cdnShaderReady, fileManifest, callback, prefix) {

	var prefix = prefix || '';

	//open source folder
	fs.readdir(sourcePath, function(err, files) {
        if (err) {
            return callback(err);
        }

		//loop over all file contents
        async.eachSeries(files, function(file, nextfile) {

			//get file stats
			var _file = path.join(sourcePath, file);

        	fs.stat(_file, function(err, stats) {
        		if (err) {
                	return nextfile(err);
            	}

            	if (stats.isDirectory()) {

            		var newprefix = (prefix.length > 0) ? prefix + '-' + file : file;

            		//if folder, go into it and look for glslp
            		MakeAllShaders.treeNode(_file, destinationPath, cdnShaderReady, fileManifest, function(err, data) {
            			if (err) {
            				return nextfile(err);
            			}
            			return nextfile();
            		}, newprefix); //prefix folder name to start (ensures unqiue shader name)
            	}

            	else {
            		var f = Main.getFileNameAndExt(file);

            		//if this is a preset file, let's open it and rewrite
            		if (f.ext === 'glslp') {

                        var savename = Main.getFileNameAndExt(prefix + '-' + file); //generate a unique name for this shader which includes the origin path
						var destinationLocation = destinationPath; // + '-' + savename.name;

            			//empty destination directory each time we work with a new glslp file
    					fs.emptyDir(destinationLocation, function (err) {

	            			//write new glslp
	            			var ws = fs.createOutputStream(destinationLocation + '/' + file);

	            			fs.readFile(sourcePath + '/' + file, 'utf8', function(err, data) {
								if (err) {
									return nextfile();
								}

								console.log('Reading file: ' + sourcePath + '/' + file);
								
								var lines = data.split('\n');
	            				
	            				//loop over each line in the glslp and correct paths, locate other glsl files
	            				async.eachSeries(lines, function(line, nextline) {


	            					//capture groups:
	            					//0: the source line
	            					//1: shader0 = 
	            					//2 the path to the shader
	            					//3 glsl
	            					var glslmatch = line.match(/(shader[\d]+ = )\"?(.*(\.glsl))\"?$/,'i');

	            					var resourcepath = line.match(/(.* = )\"?(.*(\.png))\"?$/,'i');

	            					//shader files---->
	            					if (glslmatch) {
	            						
	            						var glslfilename = glslmatch[2].match(/[^\\/]+$/)[0];

	            						ws.write(glslmatch[1] + glslfilename + '\n');

	            						fs.copy(sourcePath + '/' + glslmatch[2], destinationLocation + '/' + glslfilename, function (err) {
											if (err) {
												//if cannot find glsl file, then we should't build this shader at all
												console.log('cannot build ' + savename.name + '. missing ' + glslmatch[2]);
												return nextfile();
											} else {
												nextline();
											}
										});
	            					}
	            					//resource files ---->
	            					else if (resourcepath) {
	            						
	            						var resourcefilename = resourcepath[2].match(/[^\\/]+$/)[0];

	            						ws.write(resourcepath[1] + resourcefilename + '\n');

	            						//find the resource
	            						fs.copy(sourcePath + '/' + resourcepath[2], destinationLocation + '/' + resourcefilename, function (err) {
											if (err) {
												return nextline('Could not find resource file: ' + sourcePath + '/' + resourcepath[2]);
											}
											return nextline();
										});
	            					}
	            					else {
	            						ws.write(line + '\n');
	            						nextline();
	            					}

	            				}, function(err) {
						            if (err) {
						                return callback(err);
									}

									fs.readFile(destinationLocation + '/' + file, 'utf8', function(err, finalglsl) {
										
										console.log('Resulting file:');
										console.log('.................................');
										console.log(finalglsl);
										console.log('.................................');
										console.log('Finished: ' + destinationLocation + '/' + file);
										console.log('------------------------------------------------------------------------------');

										//record this shader
										fileManifest[savename.name] = {};
										
										CompressShaders.exec(savename.name, destinationPath, cdnShaderReady, function(err, filesize) {
											
											fileManifest[savename.name].s = filesize;

											return nextfile();
										});
									});
						        });
	            			});
						});
            		}
            		else {

            			return nextfile();
            		}
            	}
        	});

        }, function(err, result) {
			if (err) return callback(err);
			
            return callback(null, fileManifest);
        });
    });
};

MakeAllShaders.glslFlatten = function(sourcePath, destinationPath, callback) {

		//open source folder
	fs.readdir(sourcePath, function(err, files) {
        if (err) {
            return callback(err);
        }

		//loop over all file contents
        async.eachSeries(files, function(file, nextfile) {

        	//get file stats
        	fs.stat(sourcePath + '/' + file, function(err, stats) {
        		if (err) {
                	return nextfile(err);
            	}

            	if (stats.isDirectory()) {

            		//if folder, go into it and look for glslp
            		MakeAllShaders.glslFlatten(sourcePath + '/' + file, destinationPath, function(err, data) {
            			if (err) {
            				return nextfile(err);
            			}
            			return nextfile();
            		});
            	}

            	else {
            		var f = Main.getFileNameAndExt(file);

            		//if this is a preset file, let's open it and rewrite
            		if (f.ext === 'glsl') {

            			fs.access(destinationPath + '/' + file, fs.F_OK, function(err) {
            				if (err) {
            					//does not exist, thats ok
            					fs.copy(sourcePath + '/' + file, destinationPath + '/' + file, function (err) {
									return nextfile();
								});
            				} else {

            					console.log('error! ' + file + ' already exists');
            					return nextfile();
            					//exists already!
            				}
            			});
            		}
            		else {

            			return nextfile();
            		}
            	}
        	});

        }, function(err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, '');
        });
    });
};

module.exports = MakeAllShaders;