var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');
var config = require('config');
var Dropbox = require('dropbox');

UploadToDropBox = function() {
};

var dbx = new Dropbox({ 
    accessToken: config.get('dropboxaccesstoken')
});

UploadToDropBox.roms = function(system, version, sourcePath, callback) {

    var dbx = new Dropbox({ 
        accessToken: config.get('dropboxaccesstoken')
    });
    var uploadDelay = 0;
    var lastUploadTimes = [];
    var numberOfSamples = 50;
    
    //open source folder
	fs.readdir(sourcePath, function(err, titles) {
        if (err) {
            return callback(err);
        }

        var remaining = titles.length;
        var dropboxFolder = config.get("dropboxroot") + '/roms/' + system + '/' + version;

        console.log('There are ' + remaining + ' files for ' + system);

        UploadToDropBox.CreateFolderIfNotExist(dbx, dropboxFolder, function(err) {
            if (err) {
                return callback(err);
            }

            //first take a listing of all existing files
            UploadToDropBox.FilesListFolder(dbx, dropboxFolder, function(err, entries) {
                if (err) {
                    return callback(err);
                }

                console.log('Dropbox reports ' + entries.length + ' files');

                //loop over all file contents
                async.eachSeries(titles, function(title, nexttitle) {
                    
                    //dumb DS_Store
                    if (title == '.DS_Store') {
                        return nexttitle();
                    }

                    var startTime = Date.now();

                    fs.stat(sourcePath + '/' + title, function(err, stat) {
                        if (err) {
                            return nexttitle(err);
                        }

                        console.log('\r\nStarting --> ' + title);

                        //okay, before we just upload, we want to ensure that the file doesn't exist
                        //or if it does, then the file sizes must match

                        var TimeCalc = function(system, version, title) {
                            console.log('upload complete: ' + system + '/' + version + '/' + title);

                            var finishTime = Date.now();
                            var dateDiff = finishTime - startTime;
                            
                            //insert the last diff and slice the array down to size
                            lastUploadTimes.unshift(dateDiff);
                            lastUploadTimes = lastUploadTimes.slice(0, numberOfSamples - 1);

                            //calculate avg time for last tne uploads
                            var averageTime = 0;
                            var timeSum = 0;
                            for (var i = 0, len = lastUploadTimes.length; i < len; ++i) {
                                timeSum += lastUploadTimes[i];
                            }
                            averageTime = timeSum / lastUploadTimes.length;
                            
                            remaining--;
                            
                            var totalEstimatedRemainingTime = averageTime * remaining;
                            var hours = Math.floor((totalEstimatedRemainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            var minutes = Math.floor((totalEstimatedRemainingTime % (1000 * 60 * 60)) / (1000 * 60));
                            var seconds = Math.floor((totalEstimatedRemainingTime % (1000 * 60)) / 1000);

                            console.log('remaining: ' + remaining + ' of ' + titles.length);
                            console.log('remaining time: ' + hours + ':' + minutes + ':' + seconds);
                        }

                        var allGood = false;
                        var replaceFile = false;

                        //scan existing file entries
                        for (var i = 0, len = entries.length; i < len; ++i) {
                            if (title === entries[i].name) {

                                console.log(title + ' was already found on dropbox');

                                if (entries[i].size === stat.size) {

                                    console.log('The files share the same size (' + stat.size + '), no upload necessary.');
                                    
                                    remaining--;

                                    console.log('remaining: ' + remaining + ' of ' + titles.length);
                                    allGood = true;
                                } else {

                                    console.log('The files DO NOT have the same size, perhaps a failure in upload occurred --> Dropbox: ' + entries[i].size + ', file: ' + stat.size);
                                    replaceFile = true;
                                }
                            }
                        }

                        if (replaceFile) {

                            //delete the existing file
                            dbx.filesDelete({
                                path: config.get("dropboxroot") + '/roms/' + system + '/' + version + '/' + title,
                            })
                            .then(function (response) {
                                
                                UploadToDropBox.upload(sourcePath, system, title, version, (err) => {
                                    if (err) {
                                        return nexttitle(err);
                                    }
                                    TimeCalc(system, version, title);
                                    return nexttitle();
                                });
                            })
                            .catch(function (err) {
                                console.log(err)
                                return nexttitle(err);
                            });
                        }
                        else if (!allGood) {
                            console.log('The file was not found on Dropbox, uploading...');
                            UploadToDropBox.upload(sourcePath, system, title, version, (err) => {
                                if (err) {
                                    return nextentry(err);
                                }
                                TimeCalc(system, version, title);
                                setTimeout(function() {
                                    return nexttitle();
                                }, uploadDelay);
                            });
                        } else {
                            setTimeout(function() {
                                return nexttitle();
                            }, uploadDelay);
                        }
                    });

                }, function(err, result) {
                    if (err) {
                        return callback(err);
                    }
                    console.log('uploading roms to dropbox complete');
                    return callback(null, '');
                });


            });
        });
    });
};

UploadToDropBox.upload = function(sourcePath, system, title, version, callback) {

    //open file
    fs.readFile(sourcePath + '/' + title, function(err, contents) {
        if (err) {
            return callback(err);
        }

        console.log('Reading: ' + system + '/' + version + '/' + title);

        dbx.filesUpload({
            path: config.get("dropboxroot") + '/roms/' + system + '/' + version + '/' + title, 
            contents: contents 
        })
        .then(function (response) {
            return callback();
        })
        .catch(function (err) {
            console.log(err)
            return callback(err);
        });
    });
}

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

UploadToDropBox.FilesListFolder = function(dbx, path, callback) {

    var entries = [];

    console.log('Getting file list from Dropbox: ' + path);

    dbx.filesListFolder({
        path: path
    })
    .then(function(response) {
        
        console.log(response.entries.length + ' files returned');

        entries = response.entries.concat(entries);

        if (response.has_more) {

            UploadToDropBox.FilesListFolderContinue(dbx, response.cursor, function(err, entriesContinued) {
                if (err) {
                    return callback(err);
                }
                entries = entriesContinued.concat(entries);

                callback(null, entries);
            });
        } else {
            callback(null, entries);
        }

    })
    .catch(function (err) {
        return callback(err);
    });
};

UploadToDropBox.FilesListFolderContinue = function(dbx, cursor, callback) {

    console.log('Getting more files from Dropbox...');

    var entries = [];

    dbx.filesListFolderContinue({
        cursor: cursor
    })
    .then(function(response) {
        
        console.log(response.entries.length + ' files returned');

        entries = response.entries.concat(entries);

        if (response.has_more) {

            UploadToDropBox.FilesListFolderContinue(dbx, response.cursor, function(err, entriesContinued) {
                if (err) {
                    return callback(err);
                }
                entries = entriesContinued.concat(entries);

                return callback(null, entries);
            });
        } else {

            return callback(null, entries);
        }
    })
    .catch(function (err) {
        return callback(err);
    });

};

UploadToDropBox.CreateFolderIfNotExist = function(dbx, path, callback) {

    dbx.filesAlphaGetMetadata({
        path: path
    })
    .then(function(response) {
        //folder exists
        return callback();
    })
    .catch(function (err) {
        //the folder does not exist

        dbx.filesCreateFolder({
            path: path
        })
        .then(function(response) {
            //folder exists now
            return callback();
        })
        .catch(function (err) {
            return callback(err);
        });
    });
};

module.exports = UploadToDropBox;