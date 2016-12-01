var fs = require('fs-extra');
var async = require('async');
var config = require('config');
var request = require('request');
var Main = require('./main.js');

TheGamesDBPics = function() {
};

TheGamesDBPics.exec = function(system, sourceFile, destinationPath, callback) {

    var self = this;

    //read data file
    fs.readJson(sourceFile, function (err, content) {
        if (err) {
            return callback(err);            
        }

        //async does not provide a good object iterator (they state their reasons well)
        var games = [];
        for (game in content) {
            if (content[game].Images) {
                content[game].name = game;
                games.push(content[game]);
            }
        }

        //create system folder
        Main.createFolder(destinationPath + '/' + system, true, function(err) {
            if (err) {
                return callback(err);
            }

            //loop over games
            async.eachSeries(games, function(game, nextgame) {

                console.log('-----------------------\n' + game.name + '\n-----------------------');


                if (game.Images.screenshot && game.Images.screenshot.length > 0) {

                    //create a target game folder
                    Main.createFolder(destinationPath + '/' + system + '/' + game.name, true, function(err) {
                        if (err) {
                            return callback(err);
                        }

                        //loop over screenshots
                        async.eachSeries(game.Images.screenshot, function(screen, nextscreen) {

                            self.getScreenshot(screen, destinationPath + '/' + system + '/' + game.name, function(err, data) {
                                if (err) {
                                    return nextscreen(err);
                                }
                                nextscreen();
                            });                            

                        }, function(err) {
                            if (err) {
                                return nextgame(err);
                            }
                            nextgame();
                        });
                    });
                } else {
                    nextgame();
                }

            }, function(err) {
                if (err) {
                    return callback(err);
                }

                console.log('thegamesdbpics task complete. result in ' + destinationPath);

                callback();
            });
        });
    });
};

TheGamesDBPics.getScreenshot = function(object, path, callback) {

    console.log('getting screenshot from thegamesdb...');

    var self = this;
    var url = 'http://thegamesdb.net/banners/' + object.original._;
    var filename = path + '/' + (object.original._.match(/[^\/]*$/)[0]);

    request.head(url, function(err, res, body){
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);

        request(url, {timeout: 1500})
        .on('error', function(err) {
            console.log(err);
            self.getScreenshot(object, path, callback);
            return;
        })
        .pipe(fs.createWriteStream(filename)).on('close', function() {
            callback(null, filename);
        });
    });
};

module.exports = TheGamesDBPics;