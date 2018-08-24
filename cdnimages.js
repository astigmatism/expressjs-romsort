var fs = require('fs-extra');
var async = require('async');
var beep = require('beepbeep');
var Main = require('./main.js');
const path = require('path');
var colors = require('colors');
require('console-png').attachTo(console);

module.exports = new (function() {

    var _self = this;

	this.Exec = function(system, folder, usefile, source, dest, datafilePath, callback) {

        var cdnErrors = {};
        var datafile = {};

        //open data file
        //read system data file
        fs.readJson(datafilePath, function(err, datafile) {
            if (err) {
                return callback(err);
            }

            //open source folder
            fs.readdir(source, function(err, titles) {
                if (err) {
                    return callback(err);
                }

                //create a target folder
                Main.createFolder(dest, true, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    //loop over all title folders in public folder where images were downloaded
                    async.eachSeries(titles, function(title, nexttitle) {
                        
                        if (title == '.DS_Store') {
                            return nexttitle();
                        }

                        var sourceimage = path.join(source, title, '0.jpg');
                        var destination = path.join(dest, title, '0.jpg');

                        console.log(colors.blue('Copying ' + title + ' image...'));

                        //if usefile is on, we are asking to move the file to title/bestromfile (more useful for screenshots per rom file)
                        if (usefile == 'true' && title in datafile) {
                            var bestfile = datafile[title].b;
                            var details = datafile[title].f[bestfile];
                            destination = path.join(dest, title, bestfile, '0.jpg');
                        }

                        console.log(colors.blue('Copying ' + title + ' image to ' + destination));

                        //copy image to destination
                        fs.copy(sourceimage, destination, err => {
                            if (err) {
                                cdnErrors[title] = err;
                                return nexttitle();
                            }

                            return nexttitle();                      
                        });

                        // fs.readFile(sourceimage, (err, buffer) => {
                        //     if (err) return callback(err);
                        //     sharp(buffer)
                        //         .extract({ left: 94, top: 0, width:  })
                        //         .toFile(destination, function(err) {
                        //             if (err) {
                        //                 cdnErrors[title] = err;
                        //                 return nexttitle();
                        //             }

                        //             return nexttitle();                      
                        //         });
                        // });

                        // Jimp.read(sourceimage, (err, image) => {
                        //     if (err) throw err;
                        //     var w = image.bitmap.width; // the width of the image
                        //     var h = image.bitmap.height; // the height of the image

                        //     // console.log(w);
                        //     // return nexttitle();

                        //     image
                        //         .crop(4, 0, w - 4, h) //x, y, w, h
                        //         .write(destination, function() {
                        //             return nexttitle();
                        //         });
                        // });

                    }, function(err, result) {
                        if (err) {
                            return callback(err);
                        }
                        
                        console.log('\nCDN Ready process complete\n');
                        console.log('These errors occured:', colors.red(cdnErrors));

                        beep(5);
                    });
                });
            });
        });
    };

});
