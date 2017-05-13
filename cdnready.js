var fs = require('graceful-fs-extra');
var async = require('async');
var pako = require('pako');
var beep = require('beepbeep');
var Main = require('./main.js');

CDNReady = function() {
};

CDNReady.exec = function(sourcePath, destinationPath, dataFilePath, segmentSize, callback) {

    var self = this;
    var datafile = {};

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

                            //output file for filesize
                            datafile[fileorfolder] = {
                                size: 0
                            };

                            //ok, so here's the deal:
                            //if its a file: we compressed it to be included in the emulator file system
                            //if its a folder: we compress all files within it to be included in the emulator file system
                            
                            console.log('\r\nStarting --> ' + fileorfolder);

                            //what are we working with?
                            fs.stat(sourcePath + '/' + title + '/' + fileorfolder, function(err, stats) {

                                if (stats.isFile()) {

                                    //file
                                    console.log('...is a file!');

                                    var output = '{';                                   
                                    var file = fileorfolder;

                                    self.compressFile(sourcePath + '/' + title + '/' + file, file, segmentSize, function(err, fileoutput) {

                                        output += fileoutput + '}';

                                        self.writeFile(destinationPath, title, fileorfolder, output, function(err, filesize) {
                                            if (err) {
                                                return nextfileorfolder(err);
                                            }
                                            datafile[fileorfolder].size = filesize;

                                            return nextfileorfolder();
                                        });
                                    });

                                } else {

                                    //folder
                                    console.log('...is a folder!');

                                    var folder = fileorfolder;
                                    var output = '{';
                                    //file is a folder, compress all files into a single

                                    //read folder
                                    fs.readdir(sourcePath + '/' + title + '/' + folder, function(err, files) {
                                        if (err) {
                                            return nextfileorfolder();
                                        }

                                        //loop over reach rom file or folder
                                        async.eachSeries(files, function(file, nextfile) {
                                            
                                            self.compressFile(sourcePath + '/' + title + '/' + folder + '/' + file, file, segmentSize, function(err, fileoutput) {
                                                if (err) {
                                                    return nextfile(err);
                                                }

                                                output += fileoutput + ',';

                                                return nextfile();
                                            });

                                        }, function(err, result) {
                                            if (err) {
                                            }

                                            output = output.slice(0, -1); //remove last comma
                                            output += '}';

                                            self.writeFile(destinationPath, title, fileorfolder, output, function(err, filesize) {
                                                if (err) {
                                                    return nextfileorfolder(err);
                                                }
                                                datafile[fileorfolder].size = filesize;
                                                return nextfileorfolder();
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
                fs.outputJson(dataFilePath, datafile, function (err) {
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

CDNReady.compressFile = function(path, filename, segmentSize, callback) {

    var self = this;

    //open file
    fs.readFile(path, function(err, buffer) {
        if (err) {
            return nextfileorfolder(err);
        }

        var compressedSegments = self.compressFileIntoSegements(path, filename, buffer, segmentSize);

        //add line to file
        var output = '"' + Main.compress.string(filename) + '":' + JSON.stringify(compressedSegments);

        callback(null, output)
    });
};

CDNReady.writeFile = function(destinationPath, title, fileorfolder, output, callback) {

    var filename = Main.compress.string(title + fileorfolder);

    //write output file
    //create our cdn file, the name of this file is the title+(file or folder) compressed
    fs.outputFile(destinationPath + '/' + encodeURIComponent(filename) + '.json', output, function (err) {
        if (err) {
            return callback(err);
        }

        fs.stat(destinationPath + '/' + encodeURIComponent(filename) + '.json', function(err, stat) {
            if (err) {
                return callback(err);
            }

            console.log('cdnready: ' + title + ' --> ' + fileorfolder + '\r\nFile size: ' + stat.size + '\r\nFile is called: ' + filename + '.json');
        
            callback(null, stat.size);
        });
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