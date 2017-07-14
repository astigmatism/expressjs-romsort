var fs = require('fs-extra');
var async = require('async');
var beep = require('beepbeep');
var Main = require('./main.js');

/**
 * CompressShaders Constructor
 */
CompressShaders = function() {
};

CompressShaders.exec = function(name, sourcePath, destinationPath, callback) {

    var result = {};

    fs.readdir(sourcePath, function(err, items) {
        if (err) {
            return callback(err);
        }

        async.each(items, function(item, nextitem) {

            //analyize file
            fs.stat(sourcePath + '/' + item, function (err, stats) {
                if (err) {
                    return nextitem(err);
                }

                //files only
                if (stats.isFile()) {

                    fs.readFile(sourcePath + '/' + item, function(err, content) {
                        if (err) {
                            return nextitem(err);
                        }

                        //dumb DS_Store
                        if (item !== '.DS_Store') {
                            var compressedFileName = Main.compress.string(item);
                            result[compressedFileName] = Main.compress.bytearray(content);
                        }

                        return nextitem();
                    });
                }
            });

        }, function(err) {
            if (err) {
                return callback(err);
            }

            //var contents = '"' + Main.compress.json(result) + '"';

            //write result to file using name parameter
            fs.writeFile(destinationPath + '/' + name, JSON.stringify(result), 'utf8', function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null, 'file saved.');
            });
        });
    });
};

module.exports = CompressShaders;