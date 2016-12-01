var fs = require('graceful-fs-extra');
var async = require('async');
var pako = require('pako');
var beep = require('beepbeep');
var Main = require('./main.js');

CDNReady = function() {
};

CDNReady.exec = function(sourcePath, destinationPath, segmentSize, callback) {

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

                            //ok, so here's the deal:
                            //if its a file: we compressed it to be included in the emulator file system
                            //if its a folder: we compress all files within it to be included in the emulator file system
                            
                            var output = 'a({';

                            fs.stat(sourcePath + '/' + title + '/' + fileorfolder, function(err, stats) {

                                if (stats.isFile()) {
                                    var file = fileorfolder;

                                    //open file
                                    fs.readFile(sourcePath + '/' + title + '/' + file, function(err, buffer) {
                                        if (err) {
                                            return nextfileorfolder(err);
                                        }

                                        var compressedSegments = self.compressFile(buffer, segmentSize);

                                        //add line to file
                                        output += '"' + Main.compress.string(fileorfolder) + '":' + JSON.stringify(compressedSegments);

                                        //close up file
                                        output += '})';

                                        //write output file
                                        //create our cdn file, the name of this file is the title+(file or folder) compressed
                                        var filename = Main.compress.string(title + fileorfolder);
                                        fs.outputFile(destinationPath + '/' + encodeURIComponent(filename) + '.json', output, function (err) {
                                            if (err) {
                                                return nextfileorfolder(err);
                                            }
                                            console.log('cdnready: ' + title + ' --> ' + file);
                                            return nextfileorfolder();
                                        });
                                    });


                                } else {
                                    var folder = fileorfolder;
                                    //file is a folder, compress all files into a single

                                    //i have not had the need to implement this yet. perhaps with more sega cd testing

                                    return nextfileorfolder();
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
                beep(5);

	            return callback(null, '');
	        });
        });
    });
};

CDNReady.compressFile = function(buffer, segmentSize) {

    var totalsegments = Math.ceil(buffer.length / segmentSize);
    var bufferPosition = 0;

    var compressedSegments = [];

    var i = 0;
    for (i; i < totalsegments; ++i) {
        if (i === (totalsegments - 1)) {
            console.log('starting final segment');
            var ab = new ArrayBuffer(buffer.length - bufferPosition);
            var view = new Uint8Array(ab);
            for (var j = bufferPosition; j < buffer.length; ++j) {
                view[j] = buffer[bufferPosition];
                bufferPosition++;
            }
        } else {
            console.log('starting segment ' + i);
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