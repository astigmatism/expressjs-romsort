var fs = require('fs-extra');
var async = require('async');
var request = require('request');
var config = require('config');
var cheerio = require('cheerio');
var gm = require('gm');
const exec = require('child_process').exec;
var Main = require('./main.js');
require('console-png').attachTo(console);

const googleImages = require('google-images');
//Browser key 1
var client = googleImages('011110580981838212022:6cvn0m3bpw0', 'AIzaSyAmG26PFFf2lfHaLBnm-S8Nne6n0JwaxNM');

GetBoxArt = function() {
};

GetBoxArt.outputFormat = 'jpg';

GetBoxArt.exec = function(system, term, toolsDir, sourcePath, destinationPath, delay, lowerScoreThreshold, higherScoreThreshold, override, callback) {

    var datafile = {};
    var self = this;
    var lowerScore = lowerScoreThreshold || 250; //at 250 and below, we don't get box art (SEE FINDBESTROM.JS)
    var higherScore = higherScoreThreshold || 500;

	//open source folder (datafiles)
	fs.readdir(sourcePath, function(err, datafiles) {
        if (err) {
            return callback(err);
        }

		//loop over all datafiles
        async.eachSeries(datafiles, function(datafile, nextdatafile) {

            if (system && system + '.json' !== datafile) {
                return nextdatafile(null);
            }

        	fs.stat(sourcePath + '/' + datafile, function(err, stats) {
                
                //files only
                if (!stats.isFile()) {
                    return nextdatafile(null);
                }

                if (datafile === '.DS_Store') {
                    return nextdatafile();
                }

                //create a target folder (do not override if exists)
                Main.createFolder(destinationPath + '/' + system, false, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    //read data file
                    fs.readJson(sourcePath + '/' + datafile, function (err, content) {
                        if (err) {
                            return nextdatafile(err);
                        }

                        //async does not provide a good object iterator (they state their reasons well)
                        var games = [];
                        for (game in content) {
                            if (content[game].files[content[game].best] > lowerScore && content[game].files[content[game].best] <= higherScoreThreshold) {
                                games.push(game);
                            }
                        }

                        //loop over games
                        async.eachSeries(games, function(game, nextgame) {

                            console.log('----------------------------------------------------');
                            console.log(game);
                            console.log(content[game].files[content[game].best]);

                            //first check tp see if a folder already exists in the web folder
                            fs.exists(destinationPath + '/' + system + '/' + game, function(exists) {

                                //if it doesn't exist, scrape google
                                if (!exists || override == "true") {

                                    self.scrape(game, system, term, toolsDir, destinationPath, function(err) {

                                        return nextgame();

                                    }, undefined, delay);
                                
                                } else {

                                    //already exists
                                    console.log('A folder for the game "' + game + '" already exists in the web directory. You can view and modify the file there. For efficiency, we dont download art we already have.');

                                    return nextgame();
                                }
                            });

                        }, function(err) {

                            if (err) {
                                return nextdatafile(err);
                            }

                            nextdatafile();
                        });
                    });
                });

			});

        }, function(err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    });

};

GetBoxArt.scrape = function(game, system, term, toolsDir, destinationPath, callback, imageindex, delay) {

    var delay = delay || 2000;
    var self = this;
    imageindex = imageindex || 0;

    var term = term.replace('[title]', game); //game + ' ' + details.searchname + ' box';
    var url3 = 'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1223&bih=782&q=' + encodeURIComponent(term) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi89tOMoezKAhVT22MKHWQDBxYQ_AUIBygB&biw=2156&bih=1322&tbm=isch&tbs=isz:lt,islt:qsvga';
    var url2 = 'https://www.google.com/search?biw=2156&bih=1278&tbm=isch&sa=1&q=' + encodeURIComponent(term) + '&oq=Nes+Advanced+Dungeons+%26+Dragons+-+Heroes+of+the+Lance+box+front&gs_l=img.12...0.0.1.2801486.0.0.0.0.0.0.0.0..0.0....0...1c..64.img..0.0.0.L9RpRHCeZw0&bav=on.2,or.&bvm=bv.113370389,d.cGc&dpr=2&ech=1&psi=e1y1VvSoBsaWjwOhmpqIBA.1454726407284.3&ei=9Vy1VpauNcTqjwPsrb64BA&emsg=NCSR&noj=1'
    var url = 'https://www.google.com/search?q=' + encodeURIComponent(term) + '&source=lnms&tbm=isch';

    console.log('Searching (index: ' + imageindex + ', with timeout) for: ' + term);
    //console.log('url: ' + url3);

    setTimeout(function() {

        request({
            method: 'get',
            url: url3,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36',
                'cookie': 'GoogleAccountsLocale_session=en; S=account-recovery=MCt3U61J3-E; GMAIL_RTT=182; HSID=ARVz5NCfn52eqb_ub; SSID=A7rElgXRBWYbJTfXq; APISID=aic2tHALxAW3Ynru/AhGw7itqp8touweRq; SAPISID=b8Ot5ibnYd6ZhokD/AtB2nGAteUEJeDg5W; OGPC=5061900-2:5061918-5:; SID=DQAAANABAADd5gfVpq5IqqXGzLH9o2WoPCIa-li9LNHLfF1V56tvBHEyIM7UVVAUbCKGuVuCIxiT5GDUA-UFCkW-QjqIhdQHBhdTtTBWUd1NdExfntxtxBHNdI3PFKP-DAt6QtyYPbSN8r-gPwKrY7zACF4Fn992H27baHTfzo0r6husIrxzmm5FgqGZ7rLAlxXGCX-uNzFY89-fSKXVLQmsi3IZx0ryMVtzN2gayVWfFVMzNUeglMDAhEKCcV_z7SKeXbCWB1JtRrWiRwBCfeXJ_z8X9_LnKvtZOpOfUU4QfQpvZM00AD_DYtTciEsz5ci6z0BDeK8r_awnDhCdlxr8hG5KN4lgq3Hq2sgNGwJBZr2k4Fb944RNNH_oUV8fxU_LHO5AxN-NrqXm2fFTfkDKUHFhve1qDCRfMyf0IE5VXJvPG-jK6WMTV0h5gSE1uVHiMSzTZNh5kU4c_c63q2TRixqAWaTfqLTM3KaEOoaRj18tgTCcfHIR8jFaIRo37mdCHDJShPZMhsJvQHageUNNfdZ8yPEcyWJR9-uSqPjhjcplO4v5PIy50gnHTtjjP6PkoUxNXEUQI8OrOkVLG1R3wz-9oLqP_1UWePeASrZ9KHIKoVdYZQ; NID=76=CXFxLu0ZNF4gLyMxwRHV8M8P_-xzklRYgIdadt9VtSRn2_J-eFAnGPPA4K3oE2PblyYS2ZBs9qzUoxi435x_plz38bRp-qtCbcglEGwLpEgdl107UPe5h62lCx9dUn3IrD356JmyeYEtzPV3FZjKS77C2mBvravJ5U04642nfxnjLub20KBXJM0daNrLlFOKCbsFnNjMjypYwWvy8My1tkYitQR3Hq1UWqSCY9sYqhOx5P9jvGFUI2MLsJ9yA8z4-hwX6ti5GZ2lqq_-e0FVHUKjGvMeuqc; DV=Yp9juRp9tiseWsea3aFNK64afBBhpQI'
            },
            timeout: 20000
        }, function(err, response, body) {
            if (err) {
                console.log(err);
                self.scrape(game, system, term, toolsDir, destinationPath, callback, imageindex + 1, delay);
                return;
            }
            
            console.log('search retunred, getting image at index ' + imageindex);

            $ = cheerio.load(body);

            //console.log(body);

            //take all divs inside the ires id (this is where the pics live)
            //keep in mind we're scraping the google dom, data can change (and does!)
            var anchors = $('div.rg_meta', '#ires');

            if (anchors && anchors.length > imageindex) {

                var anchor = $('div.rg_meta', '#ires').get(imageindex); //returns div

                var contents = JSON.parse($(anchor).text());

                if (contents && contents.ou) {

                    var imageurl = contents.ou;

                    var fileext = imageurl.match(/\.\D{1,4}$/);

                    //no x-raw-image
                    if (imageurl.indexOf('x-raw-image') === -1) {

                        //create a target folder
                        Main.createFolder(destinationPath + '/' + system + '/' + game, true, function(err) {
                            if (err) {
                                return callback(err);
                            }

                            console.log('images folder created');

                            var originalpath = destinationPath + '/' + system + '/' + game + '/downloaded' + fileext;

                            console.log('downloading image from original source: ' + imageurl);

                            self.download(imageurl, originalpath, function(filename){
                                
                                //show image in console window
                                gm(originalpath).resize(null, 30).setFormat('png').write(destinationPath + '/console.png', function (err) {
                                    if (err) {
                                        //meh. dont really care if console image cant show
                                    } else {

                                        var consoleimage = fs.readFileSync(destinationPath + '/console.png');
                                        console.png(consoleimage);
                                        fs.removeSync(destinationPath + '/console.png');
                                    }

                                    //after scrape, save downloaded image in the format we work with
                                    self.convertImageOnObtain(toolsDir, originalpath, destinationPath + '/' + system + '/' + game, true, function(err) {
                                        if (err) {
                                            console.log('Error in saving downloaded image: ' + err);
                                        }

                                        console.log('Deleting downloaded image');

                                        fs.unlink(originalpath, function(err) {
                                            if (err) {
                                                console.log('Error deleting downloaded image');
                                            }

                                            console.log('We have completed ' + game);
                                            return callback();

                                        });
                                    });
                                });
                            });
                        });
                    } else {

                        //image is x-raw-image, try again
                        self.scrape(game, system, term, toolsDir, destinationPath, callback, imageindex + 1, delay);
                        return;
                    }
                        
                } else {
                    console.log('skipping. data had no ou attribute? (image url)');
                    return callback();
                }

            } else {
                console.log('skipping. no anchors in response? ' + anchors);
                callback();
                return;
            }
        }).on('error', function(err) {
            
            console.log('skipping. error in request ' + err);
            callback();
            return;
        });

    }, delay);
};

GetBoxArt.uploaded = function(toolsDir, file, destinationPath, callback) {

    var self = this;

    Main.createFolder(destinationPath, false, function(err) {
        if (err) {
            return callback(err);
        }

        //cleanout dir
        Main.emptydir(destinationPath, function(err) {
            if (err) {
                return callback(err);
            }

            self.convertImageOnObtain(toolsDir, file.path, destinationPath, true, function(err) {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        });
    });
};

GetBoxArt.download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);

        request(uri, {timeout: 1500})
        .on('error', function(err) {
            console.log(err);
            callback();
        })
        .pipe(fs.createWriteStream(filename)).on('close', function() {
            callback(filename);
        });
    });
};

GetBoxArt.modulate = function(imagePath, b, s, h, callback) {

    b = b || 100;
    s = s || 100;
    h = h || 100;

    console.log('Modulating image (bsh): ' + b + ',' + s + ',' + h);

    gm(imagePath).modulate(b, s, h).write(imagePath, function(err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};

GetBoxArt.convertImageOnObtain = function(toolsDir, sourceImage, destinationPath, autoTone, callback) {

    var self = this;

    //after scrape, save downloaded image in the format we work with
    gm(sourceImage).setFormat(self.outputFormat).write(destinationPath + '/original.' + self.outputFormat, function (err) {
        if (err) {
            return callback(err);
        }

        //autotone this image? (come on, say yes!!)
        if (autoTone) {
            exec(toolsDir + 'autotone "' + destinationPath + '/original.' + self.outputFormat + '" "' + destinationPath + '/original.' + self.outputFormat + '"', function (err, stdout, stderr) {
                if (err) {
                    console.log('stderr: ' + stderr);
                    return callback(err);
                }
                return callback();
            });
        } else {
            return callback();
        }
    });
};

GetBoxArt.updateMeta = function(datafileSource, title, topsuggestion, callback) {

    fs.exists(datafileSource, function(exists) {

        if (!exists) {
            return callback(datafileSource + ' does not exist');
        }

        //read screenshot datafile
        fs.readJson(datafileSource, function(err, datafile) {
            if (err) {
                return callback(err);
            }

            if (title in datafile) {
                
                datafile[title].ts = topsuggestion;
            }

            //write data file
            fs.writeFile(datafileSource, JSON.stringify(datafile), function(err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });

        });
    });
};

module.exports = GetBoxArt;