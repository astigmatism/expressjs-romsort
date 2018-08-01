var fs = require('fs-extra');
var async = require('async');
var request = require('request');
var config = require('config');
var cheerio = require('cheerio');
var gm = require('gm');
const exec = require('child_process').exec;
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
                        
                        var sourceimage = path.join(source, title, 'original.jpg');
                        var titlename = Main.compress.string(title);
                        var destination = path.join(dest, titlename, '0.jpg');

                        //if usefile is on, we are asking to move the file to title/bestromfile (more useful for screenshots per rom file)
                        if (usefile == 'on' && title in datafile) {
                            var bestfile = datafile[title].b;
                            var details = datafile[title].f[bestfile];
                            destination = path.join(dest, title, bestfile, '0.jpg');
                        }

                        //copy image to destination
                        console.log(colors.blue('Copying ' + title + ' image...'));
                        fs.copy(sourceimage, destination, err => {
                            if (err) {
                                cdnErrors[title] = err;
                                return nexttitle();
                            }

                            return nexttitle();                      
                        });

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
