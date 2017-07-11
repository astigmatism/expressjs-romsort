var Main = require('./main.js');
var fs = require('graceful-fs-extra');
var async = require('async');
var pako = require('pako');
var beep = require('beepbeep');

SupportFiles = function() {
};

SupportFiles.exec = function(system, segmentSize, sourcePath, destinationPath, callback) {

    var self = this;

	//open source folder
	fs.readdir(sourcePath, function(err, files) {
        if (err) {
            return callback(err);
        }

        var output = 'c({';

        //loop over all title (game) folders
        async.eachSeries(files, function(file, nextfile) {

            fs.stat(sourcePath + '/' + file, function(err, stats) {
                
                //bail if a file, folders only for titles
                if (!stats.isFile()) {
                    return nextfile(null);
                }

                //open file
                fs.readFile(sourcePath + '/' + file, function(err, buffer) {
                    if (err) {
                        return nextfile(err);
                    }

                    console.log('compressing --> ' + file);

                    var compressedSegments = self.compressFile(buffer, segmentSize);

                    //add line to file
                    output += '"' + Main.compress.string(file) + '":' + JSON.stringify(compressedSegments) + ',';

                    nextfile();
                });
            });

        }, function(err, result) {
            if (err) {
                return callback(err);
            }

            //close up file
            output = output.substring(0, output.length - 1); //remove final comma
            output += '})';

            //write output file
            //create our cdn file, the name of this file is the title+(file or folder) compressed
            fs.outputFile(destinationPath + '/' + system + '.json', output, function (err) {
                if (err) {
                    return callback(err);
                }
                console.log('SupportFiles complete');
                
                beep(5);

                return callback(null, '');
            });
        });
    });
};

SupportFiles.compressFile = function(buffer, segmentSize) {

    var totalsegments = Math.ceil(buffer.length / segmentSize);
    var bufferPosition = 0;

    var compressedSegments = [];

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

module.exports = SupportFiles;