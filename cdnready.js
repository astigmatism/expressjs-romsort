var fs = require('graceful-fs-extra');
var async = require('async');
var pako = require('pako');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');

CDNReady = function() {
};

CDNReady.exec = function(sourcePath, destinationPath, fileDataPath, segmentSize, callback) {

    var self = this;
    var fileData = {};

	//open source folder
	fs.readdir(sourcePath, function(err, titles) {
        if (err) {
            return callback(err);
        }

        //create a target folder
        Main.createFolder(destinationPath, true, function(err) {
        	if (err) {
        		return callback(err);
        	}

			//loop over all title (game) folders
	        async.eachSeries(titles, function(title, nexttitle) {

	        	fs.stat(sourcePath + '/' + title, function(err, stats) {
	                
	                //bail if a file, folders only for titles
	                if (stats.isFile()) {
	                    return nexttitle(null);
	                }

	                //read title folder
	                fs.readdir(sourcePath + '/' + title, function(err, roms) {
	                    if (err) {
	                        return nexttitle(err);
	                    }

                        //loop over reach rom file or folder
                        async.eachSeries(roms, function(fileorfolder, nextfileorfolder) {

                            if (fileorfolder == '.DS_Store') {
                                return nextfileorfolder();
                            }

                            var compressedName = Main.compress.string(fileorfolder);

                            //output file for filesize
                            //compress the file name, I was running into issues with filenames with weird characters
                            fileData[compressedName] = {
                                s: 0
                            };

                            //ok, so here's the deal:
                            //if its a file: we compressed it to be included in the emulator file system
                            //if its a folder: we compress all files within it to be included in the emulator file system
                            
                            console.log('\r\nStarting --> ' + fileorfolder + ' : ' + compressedName);

                            var sourceFilePath = path.join(sourcePath, title, fileorfolder);

                            //what are we working with?
                            fs.stat(sourceFilePath, function(err, stats) {

                                if (stats.isFile()) {

                                    //file
                                    console.log('...is a file!');
                                    var file = fileorfolder;

                                    //begin by writing an empty title file which we can append to
                                    self.CreateFile(destinationPath, title, file, '{', function(err, destinationFilePath, filename) {
                                        if (err) {
                                            return nextfileorfolder(err);
                                        }

                                        self.WriteGameFile(destinationFilePath, sourceFilePath, file, segmentSize, (err, filesize) => {
                                            if (err) {
                                                return nextfileorfolder(err);
                                            }

                                            //close output json with bracket
                                            fs.appendFile(destinationFilePath, '}', (err) => {
                                                if (err) {
                                                    return nextfileorfolder(err);
                                                }
                                                
                                                //get resulting filesize
                                                fs.stat(destinationFilePath, (err, stat) => {

                                                    fileData[compressedName].s = stats.size;

                                                    console.log('cdnready: ' + title + ' --> ' + file + '\r\nFile size: ' + stat.size + '\r\nFile is called: ' + filename);
                                                    return nextfileorfolder();     
                                                });

                                            });
                                        });
                                    });

                                } else {

                                    //is a folder
                                    //this is different enough from the task if it were a file
                                    //for a folder, write one destination file with all the files as properties

                                    console.log('...is a folder!');

                                    var folder = fileorfolder;
                                    //file is a folder, compress all files into a single

                                    //read folder
                                    fs.readdir(sourceFilePath, function(err, files) {
                                        if (err) {
                                            return nextfileorfolder();
                                        }

                                        //begin by writing an empty title file which we can append to
                                        self.CreateFile(destinationPath, title, folder, '{', function(err, destinationFilePath, filename) {
                                            if (err) {
                                                return nextfileorfolder(err);
                                            }

                                            //loop over reach rom file or folder
                                            async.eachOfSeries(files, function(file, i, nextfile) {

                                                var sourceFilePathFile = path.join(sourceFilePath, file);

                                                self.WriteGameFile(destinationFilePath, sourceFilePathFile, file, segmentSize, (err, filesize) => {
                                                    if (err) {
                                                        return nextfile(err);
                                                    }

                                                    //are there more files? If so, append a comma
                                                    if (i !== (files.length -1)) {
                                                        fs.appendFile(destinationFilePath, ',', (err) => {
                                                            if (err) {
                                                                return nextfile(err);
                                                            }
                                                            return nextfile();
                                                        });
                                                    } 
                                                    else {
                                                        return nextfile();
                                                    }
                                                });

                                            }, function(err, result) {
                                                if (err) {
                                                }

                                                //close output json with bracket
                                                fs.appendFile(destinationFilePath, '}', (err) => {
                                                    if (err) {
                                                        return nextfileorfolder(err);
                                                    }
                                                    
                                                    //get resulting filesize
                                                    fs.stat(destinationFilePath, (err, stat) => {

                                                        fileData[compressedName].s = stat.size;

                                                        console.log('cdnready: ' + title + ' --> ' + fileorfolder + '\r\nFile size: ' + stat.size + '\r\nFile is called: ' + filename);
                                                        return nextfileorfolder();
                                                    });

                                                });
                                            });
                                        });
                                    });

                                }
                            });

                        }, function(err, result) {
                            if (err) {
                                
                                fs.appendFile(sourcePath + '/errors.json', 'Error: ' + JSON.stringify(err) + '\n', function(err2) {
                                    if (err) {
                                        return nexttitle(err2);
                                    }
                                    return nexttitle(err);
                                });
                            }
                            nexttitle(null);
                        });

                    });
				});

	        }, function(err, result) {
	            if (err) {
	                return callback(err);
	            }

                //write file which contains file sizes (for download progress)
                fs.outputFile(fileDataPath, JSON.stringify(fileData), function (err) {
                    if (err) {
                        return callback(err);
                    }
                    beep(5);

	                return callback();
                });
	        });
        });
    });
};

CDNReady.CreateFile = function(destinationPath, title, fileorfolder, output, callback) {

    var filename = Main.compress.string(title + fileorfolder);
    var path = destinationPath + '/' + encodeURIComponent(filename);

    //write output file
    //create our cdn file, the name of this file is the title+(file or folder) compressed
    fs.outputFile(path, output, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, path, filename);
    });
};

CDNReady.WriteGameFile = function(destinationFilePath, sourceFilePath, filename, segmentSize, callback) {

    var self = this;

    self.compressFile(sourceFilePath, filename, segmentSize, function(err, compressedSegments) {
        if (err) {
            return callback(err);
        }

        //json property is compressed filename
        fs.appendFile(destinationFilePath, '"' + Main.compress.string(filename) + '": [', (err) => {
            if (err) {
                return callback(err);
            }

            //loop over each segment
            async.eachOfSeries(compressedSegments, function (segment, j, nextSegment) {
                
                segment = '"' + segment + '"';

                //is this not the last segment?
                if (j !== (compressedSegments.length -1)) {
                    segment += ',';
                }
                else {
                    segment += ']';
                }

                //append segment to file
                fs.appendFile(destinationFilePath, segment, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    return nextSegment();
                });
                
            }, function(err, result) {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        });
    });
};

CDNReady.compressFile = function(path, filename, segmentSize, callback) {

    var self = this;

    //open file
    fs.readFile(path, function(err, buffer) {
        if (err) {
            return callback(err);
        }

        //returns array
        var compressedSegments = self.compressFileIntoSegements(path, filename, buffer, segmentSize);

        callback(null, compressedSegments);
    });
};

CDNReady.compressFileIntoSegements = function(path, filename, buffer, segmentSize) {

    var totalsegments = Math.ceil(buffer.length / segmentSize);
    var bufferPosition = 0;

    var compressedSegments = [];

    var i = 0;
    for (i; i < totalsegments; ++i) {
        console.log(filename + ' --> Starting segment ' + i);
        if (i === (totalsegments - 1)) {
            var ab = new ArrayBuffer(buffer.length - bufferPosition);
            var view = new Uint8Array(ab);
            for (var j = bufferPosition; j < buffer.length; ++j) {
                view[j] = buffer[bufferPosition];
                bufferPosition++;
            }
        } else {
            var ab = new ArrayBuffer(segmentSize);
            var view = new Uint8Array(ab);
            for (var j = 0; j < segmentSize; ++j) {
                view[j] = buffer[bufferPosition];
                bufferPosition++;
            }
        }
        var deflated = pako.deflate(view, {to: 'string'});
        compressedSegments[i] = Main.compress.string(deflated);
    }

    return compressedSegments;
};

module.exports = CDNReady;