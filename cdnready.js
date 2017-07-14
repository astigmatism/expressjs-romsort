var fs = require('graceful-fs-extra');
var async = require('async');
var pako = require('pako');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');

CDNReady = function() {
};

var _compressEverything = false; //for debugging

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

                            //the resulting file name will be the combination of title and file (or folder) for uniquness
                            var destinationFileName = Main.compress.string(title + fileorfolder);
                            destinationFileName = encodeURIComponent(destinationFileName);

                            //output file for filesize
                            //compress the file name, I was running into issues with filenames with weird characters
                            fileData[destinationFileName] = {
                                s: 0
                            };

                            //ok, so here's the deal:
                            //if its a file: we compressed it to be included in the emulator file system
                            //if its a folder: we compress all files within it to be included in the emulator file system
                            
                            console.log('\r\nStarting --> ' + fileorfolder);

                            var sourceFilePath = path.join(sourcePath, title, fileorfolder);

                            //what are we working with?
                            fs.stat(sourceFilePath, function(err, stats) {

                                if (stats.isFile()) {

                                    //file
                                    /*

                                    key:
                                    f: files

                                    object:
                                    {
                                        f: {
                                            filename: [string, string, ...]
                                        }
                                    }

                                    */
                                    console.log('... this is a file');
                                    var file = fileorfolder;
                                    var destinationFilePath = path.join(destinationPath, destinationFileName);

                                    //begin by writing an empty json file which we can append details to
                                    self.CreateFile(destinationFilePath, '{"f":{', function(err) {
                                        if (err) {
                                            return nextfileorfolder(err);
                                        }

                                        //files are written as json properties
                                        self.WriteGameFileAsJson(sourceFilePath, destinationFilePath, file, segmentSize, (err) => {
                                            if (err) {
                                                return nextfileorfolder(err);
                                            }

                                            //close output json with bracket
                                            fs.appendFile(destinationFilePath, '}}', (err) => {
                                                if (err) {
                                                    return nextfileorfolder(err);
                                                }
                                                
                                                //get resulting filesize
                                                fs.stat(destinationFilePath, (err, stat) => {

                                                    fileData[destinationFileName].s = stats.size;

                                                    console.log('cdnready: ' + title + ' + ' + file + '\r\nFile size: ' + stat.size + '\r\n');
                                                    return nextfileorfolder();     
                                                });

                                            });
                                        });
                                    });

                                } else {

                                    //is a folder
                                    //this is different enough from the task if it were a file
                                    //for a folder, write one destination file with all the files as properties

                                    console.log('...this is a folder');

                                    var folder = fileorfolder;
                                    //file is a folder, compress all files into a single

                                    //read folder
                                    /*

                                    key:
                                    f: files
                                    b: best game to boot in emaultor

                                    object:
                                    {
                                        f: {
                                            filename1: [string, string, ...],
                                            filename2: [string],
                                            ...
                                        },
                                        b: string
                                    }

                                    */
                                    fs.readdir(sourceFilePath, function(err, files) {
                                        if (err) {
                                            return nextfileorfolder();
                                        }

                                        var destinationFilePath = path.join(destinationPath, destinationFileName);

                                        //begin by writing an empty title file which we can append to
                                        self.CreateFile(destinationFilePath, '{"f":{', function(err) {
                                            if (err) {
                                                return nextfileorfolder(err);
                                            }

                                            //since this game has a multiple file structure, we need to decide which file to bootstrap in the emulator
                                            var bestBootCandidate = Main.compress.string(self.DetermineBootCandidate(files));

                                            //loop over reach rom file in folder folder
                                            async.eachOfSeries(files, function(file, i, nextfile) {

                                                var sourceFolderPathFile = path.join(sourceFilePath, file);

                                                self.WriteGameFileAsJson(sourceFolderPathFile, destinationFilePath, file, segmentSize, (err) => {
                                                    if (err) {
                                                        return nextfile(err);
                                                    }

                                                    //are there more files? If so, append a comma between object properties
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
                                                    return nextfileorfolder(err);
                                                }

                                                //we'll need to inform the emulator which file to bootstrap, lets write it here
                                                fs.appendFile(destinationFilePath, '},\"b\":\"' + bestBootCandidate + '\"', (err) => {
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

                                                            fileData[destinationFileName].s = stats.size;

                                                            console.log('cdnready: ' + title + ' + ' + folder + '\r\nFile size: ' + stat.size + '\r\n');
                                                            return nextfileorfolder();     
                                                        });

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

CDNReady.CreateFile = function(destinationFilePath, output, callback) {

    console.log('Creating destination file --> ' + destinationFilePath);

    //write output file
    //create our cdn file, the name of this file is the title+(file or folder) compressed
    fs.outputFile(destinationFilePath, output, function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};

CDNReady.WriteGameFileAsJson = function(sourceFilePath, destinationFilePath, filename, segmentSize, callback) {

    var self = this;

    self.compressFile(sourceFilePath, segmentSize, function(err, compressedSegments, bufferLength) {
        if (err) {
            return callback(err);
        }

        var compressedFileName = Main.compress.string(filename);

        //json property is compressed filename
        console.log('Appending file to json --> ' + compressedFileName);

        fs.appendFile(destinationFilePath, '"' + compressedFileName + '": [', (err) => {
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

                console.log('file has ' + compressedSegments.length + ' segment(s)');

                return callback(null, compressedFileName, bufferLength);
            });
        });
    });
};

CDNReady.compressFile = function(sourceFilePath, segmentSize, callback) {

    var self = this;

    //open file
    fs.readFile(sourceFilePath, function(err, buffer) {
        if (err) {
            return callback(err);
        }

        //returns array
        var compressedSegments = self.compressFileIntoSegements(buffer, segmentSize);

        callback(null, compressedSegments, buffer.length);
    });
};

CDNReady.compressFileIntoSegements = function(buffer, segmentSize) {

    var totalsegments = Math.ceil(buffer.length / segmentSize);
    var bufferPosition = 0;

    var compressedSegments = [];

    console.log('compressing buffer into segments');

    var i = 0;
    for (i; i < totalsegments; ++i) {
        console.log('Starting segment --> ' + i);
        if (i === (totalsegments - 1)) {
            var finalSegementLength = buffer.length - bufferPosition;
            var ab = new ArrayBuffer(finalSegementLength);
            var view = new Uint8Array(ab);
            for (var j = 0; j < finalSegementLength; ++j) {
                view[j] = buffer[bufferPosition];
                //console.log(bufferPosition + ': ' + view[j]);
                bufferPosition++;
            }
        } else {
            var ab = new ArrayBuffer(segmentSize);
            var view = new Uint8Array(ab);
            for (var j = 0; j < segmentSize; ++j) {
                view[j] = buffer[bufferPosition];
                //console.log(bufferPosition + ': ' + view[j]);
                bufferPosition++;
            }
        }

        console.log('segment written with length --> ' + view.length);

        var deflated = pako.deflate(view, {to: 'string'});
        compressedSegments[i] = Main.compress.string(deflated);
    }

    return compressedSegments;
};

CDNReady.DetermineBootCandidate = function(files) {

    var best = files[0];

    for (var i = 0, len = files.length; i < len; ++i) {
        
        var details = path.parse(files[i]);

        if (details.ext === '.cue') {
            best = files[i];
        }
    }

    console.log('found best file to boot: ' + best);
    return best;
};

module.exports = CDNReady;