var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var config = require('config');
var Dropbox = require('dropbox');

UploadToDropBox = function() {
};

UploadToDropBox.roms = function(system, version, sourcePath, callback) {

    var dbx = new Dropbox({ 
        accessToken: config.get('dropboxaccesstoken')
    });
    
    //open source folder
	fs.readdir(sourcePath, function(err, titles) {
        if (err) {
            return callback(err);
        }

        console.log('There are ' + titles.length + ' for ' + system);

        //loop over all file contents
	    async.eachSeries(titles, function(title, nexttitle) {
            
            //dumb DS_Store
            if (title == '.DS_Store') {
                return nexttitle();
            }

            //open file
            fs.readFile(sourcePath + '/' + title, function(err, contents) {
                if (err) {
                    return nexttitle(err);
                }

                console.log('\r\nStarting --> ' + system + '/' + version + '/' + title);

                dbx.filesUpload({
                    path: config.get("dropboxroot") + '/roms/' + system + '/' + version + '/' + title, 
                    contents: contents 
                })
                .then(function (response) {
                    console.log('upload complete --> ' + system + '/' + version + '/' + title);
                    return nexttitle();
                })
                .catch(function (err) {
                    return nexttitle(err);
                });
            });

        }, function(err, result) {
            if (err) {
                return callback(err);
            }
            console.log('uploading roms to dropbox complete');
            return callback(null, '');
        });
    });
};

UploadToDropBox.boxes = function(system, version, sourcePath, callback) {

    var dbx = new Dropbox({ 
        accessToken: config.get('dropboxaccesstoken')
    });
    
    //open source folder
	fs.readdir(sourcePath, function(err, titles) {
        if (err) {
            return callback(err);
        }

        //loop over all title folders
	    async.eachSeries(titles, function(title, nexttitle) {
            
            //dumb DS_Store
            if (title == '.DS_Store') {
                return nexttitle();
            }

            //open title folder
            fs.readdir(sourcePath + '/' + title, function(err, images) {
                if (err) {
                    return callback(err);
                }

                //loop over all images
	            async.eachSeries(images, function(image, nextimage) {

                    //open file
                    fs.readFile(sourcePath + '/' + title + '/' + image, function(err, contents) {
                        if (err) {
                            return nexttitle(err);
                        }

                        dbx.filesUpload({
                            path: config.get("dropboxroot") + '/boxes/' + system + '/' + version + '/' + title + '/' + image, 
                            contents: contents 
                        })
                        .then(function (response) {
                            console.log('upload box complete --> ' + system + '/' + version + '/' + title + '/' + image);
                            return nextimage();
                        })
                        .catch(function (err) {
                            return nextimage(err);
                        });
                    });

                }, function(err, result) {
                    if (err) {
                        return nextimage(err);
                    }
                    return nexttitle();
                });
            });

        }, function(err, result) {
            if (err) {
                return callback(err);
            }
            console.log('uploading boxes to dropbox complete');
            return callback(null, '');
        });
    });
};

module.exports = UploadToDropBox;