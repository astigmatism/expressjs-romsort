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
    var uploadDelay = 0;
    
    //open source folder
	fs.readdir(sourcePath, function(err, titles) {
        if (err) {
            return callback(err);
        }

        console.log('There are ' + titles.length + ' for ' + system);
        var remaining = titles.length;

        //first take a listing of all existing files
        dbx.filesListFolder({
            path: config.get("dropboxroot") + '/roms/' + system + '/' + version
        })
        .then(function(response) {

            //console.log(response);

            //loop over all file contents
            async.eachSeries(titles, function(title, nexttitle) {
                
                //dumb DS_Store
                if (title == '.DS_Store') {
                    return nexttitle();
                }

                fs.stat(sourcePath + '/' + title, function(err, stat) {
                    if (err) {
                        return nexttitle(err);
                    }

                    //okay, before we just upload, we want to ensure that the file doesn't exist
                    //or if it does, then the file sizes must match

                    for (var i = 0, len = response.entries.length; i < len; ++i) {
                        if (title === response.entries[i].name) {

                            console.log('The file ' + title + ' was already found on dropbox');

                            if (response.entries[i].size === stat.size) {

                                console.log('The files share the same size (' + stat.size + '), no upload necessary.');
                                
                                remaining--;
                                console.log('remaining: ' + remaining + ' of ' + titles.length);
                                return nexttitle();
                            } else {

                                console.log('The files DO NOT have the same size, perhaps a failure in upload occurred --> Dropbox: ' + response.entries[i].size + ', file: ' + stat.size);
                            }
                        }
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
                            
                            remaining--;
                            console.log('remaining: ' + remaining + ' of ' + titles.length);
                            
                            setTimeout(function() {
                                return nexttitle();
                            }, uploadDelay);
                        })
                        .catch(function (err) {
                            console.log(err)
                            return nexttitle(err);
                        });
                    });
                });

            }, function(err, result) {
                if (err) {
                    return callback(err);
                }
                console.log('uploading roms to dropbox complete');
                return callback(null, '');
            });


        })
        .catch(function(error) {
            console.error(error);
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