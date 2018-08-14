var fs = require('graceful-fs-extra');
var async = require('async');
var pako = require('pako');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');
var colors = require('colors');

CDNReady = function() {
};

var _compressEverything = false; //for debugging
var cdnErrors = {};

CDNReady.exec = function(sourcePath, destinationRoot, fileDataPath, segmentSize, callback) {

    var self = this;
    var fileData = {};

	//open source folder
	fs.readdir(sourcePath, (err, titles) => {
        if (err) {
            return callback(err);
        }

        //create a target folder
        Main.createFolder(destinationRoot, true, err => {
        	if (err) {
        		return callback(err);
        	}

			//loop over all title (game) folders
	        async.eachSeries(titles, function(title, nexttitle) {

                var titleFolder = path.join(sourcePath, title);

	        	fs.stat(titleFolder, (err, stats) => {
	                
	                //bail if a file, folders only for titles
	                if (stats.isFile()) return nexttitle(null);

	                //read title folder
	                fs.readdir(titleFolder, (err, roms) => {
	                    if (err) {
                            cdnErrors[title] = err;
	                        return nexttitle(err);
                        }
                        
                        fileData[title] = {};

                        var destinationTitle = path.join(destinationRoot, title);

                        //write title folder to destination
                        Main.createFolder(destinationTitle, true, err => {
                            if (err) {
                                cdnErrors[title] = err;
                                return nexttitle(err);
                            }


                            //loop over reach rom file or folder
                            async.eachSeries(roms, (fileorfolder, nextfileorfolder) => {

                                if (fileorfolder == '.DS_Store') {
                                    return nextfileorfolder();
                                }

                                console.log(fileorfolder + ' ...');


                                //output file for filesize
                                //compress the file name, I was running into issues with filenames with weird characters
                                fileData[title][fileorfolder] = {
                                    f: fileorfolder,
                                    s: 0
                                };

                                //ok, so here's the deal:
                                //if its a file: we compressed it to be included in the emulator file system
                                //if its a folder: we compress all files within it to be included in the emulator file system
                                
                                //console.log(colors.green('    CDN file name: ' + title + fileorfolder + ' --> ' + destinationFileName));

                                var sourceFilePath = path.join(sourcePath, title, fileorfolder);

                                //what are we working with?
                                fs.stat(sourceFilePath, err, stats => {

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
                                        console.log(colors.green('    This is a file (not a folder)'));

                                        var file = fileorfolder;
                                        var destinationFilePath = path.join(destinationTitle, file);

                                        //begin by writing an empty json file which we can append details to
                                        self.CreateFile(destinationFilePath, '{"f":{', function(err) {
                                            if (err) {
                                                cdnErrors[file] = err;
                                                return nextfileorfolder(err);
                                            }

                                            //files are written as json properties
                                            self.WriteGameFileAsJson(sourceFilePath, destinationFilePath, file, segmentSize, (err) => {
                                                if (err) {
                                                    cdnErrors[file] = err;
                                                    return nextfileorfolder(err);
                                                }

                                                //close output json with bracket
                                                fs.appendFile(destinationFilePath, '}}', (err) => {
                                                    if (err) {
                                                        cdnErrors[file] = err;
                                                        return nextfileorfolder(err);
                                                    }
                                                    
                                                    //get resulting filesize
                                                    fs.stat(destinationFilePath, (err, stat) => {

                                                        fileData[title][fileorfolder].s = stat.size;

                                                        console.log(colors.green('    Resulting file size: ' + stat.size));
                                                        console.log(colors.blue('    CDN Ready!'));
                                                        return nextfileorfolder();     
                                                    });

                                                });
                                            });
                                        });

                                    } else {

                                        //is a folder
                                        //this is different enough from the task if it were a file
                                        //for a folder, write one destination file with all the files as properties

                                        console.log(colors.green('    This is a folder (not a file)'));

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
                                                cdnErrors[folder] = err;
                                                return nextfileorfolder();
                                            }

                                            var destinationFilePath = path.join(destinationRoot, destinationFileName);

                                            //begin by writing an empty title file which we can append to
                                            self.CreateFile(destinationFilePath, '{"f":{', function(err) {
                                                if (err) {
                                                    cdnErrors[folder] = err;
                                                    return nextfileorfolder(err);
                                                }

                                                //since this game has a multiple file structure, we need to decide which file to bootstrap in the emulator
                                                var bestBootCandidate = Main.compress.string(self.DetermineBootCandidate(files));

                                                //loop over reach rom file in folder folder
                                                async.eachOfSeries(files, function(file, i, nextfile) {

                                                    var sourceFolderPathFile = path.join(sourceFilePath, file);

                                                    self.WriteGameFileAsJson(sourceFolderPathFile, destinationFilePath, file, segmentSize, (err) => {
                                                        if (err) {
                                                            cdnErrors[file] = err;
                                                            return nextfile(err);
                                                        }

                                                        //are there more files? If so, append a comma between object properties
                                                        if (i !== (files.length -1)) {
                                                            fs.appendFile(destinationFilePath, ',', (err) => {
                                                                if (err) {
                                                                    cdnErrors[file] = err;
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
                                                        cdnErrors[folder] = err;
                                                        return nextfileorfolder(err);
                                                    }

                                                    //we'll need to inform the emulator which file to bootstrap, lets write it here
                                                    fs.appendFile(destinationFilePath, '},\"b\":\"' + bestBootCandidate + '\"', (err) => {
                                                        if (err) {
                                                            cdnErrors[folder] = err;
                                                            return nextfileorfolder(err);
                                                        }
                                                        
                                                        //close output json with bracket
                                                        fs.appendFile(destinationFilePath, '}', (err) => {
                                                            if (err) {
                                                                cdnErrors[folder] = err;
                                                                return nextfileorfolder(err);
                                                            }
                                                            
                                                            //get resulting filesize
                                                            fs.stat(destinationFilePath, (err, stat) => {

                                                                fileData[destinationFileName].s = stat.size;

                                                                console.log(colors.green('    Resulting file size: ' + stat.size));
                                                                console.log(colors.blue('    CDN Ready!'));
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
                                    cdnErrors[title] = err;
                                    return nexttitle(err);
                                }
                                nexttitle(null);
                            });
                        });
                    });
				});

	        }, function(err, result) {
	            if (err) {
	                return callback(err);
	            }

                //write file which contains file sizes (for download progress)
                fs.outputJson(fileDataPath, fileData, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    console.log('Checking for existance of each file');

                    //check for existance of each file
                    async.forEachOf(fileData, function(value, key, next) {

                        var filePath = path.join(destinationRoot, key);

                        fs.exists(filePath, (exists) => {

                            if (!exists) {
                                console.log(colors.red('        ' + value.f + ' NOT FOUND'));
                                cdnErrors[value.f] = 'The resulting file "' + key + '" was not found';
                            }
                            else {
                                console.log(colors.green('        ' + value.f + ' found'));
                            }

                            return next();
                        });


                    }, function(err, result) {
                        if (err) {
                            return callback(err);
                        }
                        
                        console.log('\nCDN Ready process complete\n');
                        console.log('These errors occured:', colors.red(cdnErrors));

                        beep(5);

                        return callback();
                    });
                });
	        });
        });
    });
};

CDNReady.CreateFile = function(destinationFilePath, output, callback) {

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
        //console.log('Appending file to json --> ' + compressedFileName);

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

                console.log(colors.green('    File has ' + compressedSegments.length + ' segment(s)'));

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

    console.log(colors.green('    Compressing buffer into segments:'));

    var i = 0;
    for (i; i < totalsegments; ++i) {
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

        console.log(colors.cyan('        Segment ' + i + ' length is: ' + view.length));

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