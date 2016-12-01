var fs = require('fs-extra');
var async = require('async');
var request = require('request');
var config = require('config');
var cheerio = require('cheerio');
var gm = require('gm');
var Main = require('./main.js');
require('console-png').attachTo(console);

const googleImages = require('google-images');
//Browser key 1
var client = googleImages('011110580981838212022:6cvn0m3bpw0', 'AIzaSyAmG26PFFf2lfHaLBnm-S8Nne6n0JwaxNM');

GetBoxArt = function() {
};

GetBoxArt.resizes = [170, 120, 50];
GetBoxArt.outputFormat = 'jpg';

GetBoxArt.exec = function(system, term, sourcePath, destinationPath, webDestination, delay, callback) {

    var datafile = {};
    var self = this;
    var threshold = 250; //SEE FINDBESTROM.JS

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
                            if (content[game].files[content[game].best] > threshold) {
                                games.push(game);
                            }
                        }

                        //loop over games
                        async.eachSeries(games, function(game, nextgame) {

                            console.log('----------------------------------------------------');
                            console.log(game);
                            console.log(content[game].files[content[game].best]);

                            //first check tp see if a folder already exists in the web folder
                            fs.exists(webDestination + '/' + system + '/' + game, function(exists) {

                                //if it doesn't exist, scrape google
                                if (!exists) {

                                    self.scrape(game, system, term, destinationPath, function(err) {

                                        return nextgame();

                                    }, undefined, delay);
                                
                                } else {

                                    //already exists
                                    console.log('A folder for the game ' + game + ' already exists in the web directory. you can view and modify the file there.');

                                }
                            });

                        }, function(err) {

                            if (err) {
                                return nextdatafile(err);
                            }

                            console.log('copy all results to the web folder');

                            //finally, copy entire result to webfolder
                            fs.copy(destinationPath + '/' + system, webDestination + '/' + system, {
                                clobber: false
                            }, function (err) {
                                if (err) {
                                    return callback(err);
                                }

                                nextdatafile();
                            });
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

GetBoxArt.scrape = function(game, system, term, destinationPath, callback, imageindex, delay) {

    var delay = delay || 2000;
    var self = this;
    imageindex = imageindex || 0;

    var term = term.replace('[title]', game); //game + ' ' + details.searchname + ' box';
    var url3 = 'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1223&bih=782&q=' + encodeURIComponent(term) + '&oq=hello&gs_l=img.3..0l10.2987.3491.0.3684.5.5.0.0.0.0.151.151.0j1.1.0....0...1ac.1.64.img..4.1.150.0JEY7yau9_Y';
    var url2 = 'https://www.google.com/search?biw=2156&bih=1278&tbm=isch&sa=1&q=' + encodeURIComponent(term) + '&oq=Nes+Advanced+Dungeons+%26+Dragons+-+Heroes+of+the+Lance+box+front&gs_l=img.12...0.0.1.2801486.0.0.0.0.0.0.0.0..0.0....0...1c..64.img..0.0.0.L9RpRHCeZw0&bav=on.2,or.&bvm=bv.113370389,d.cGc&dpr=2&ech=1&psi=e1y1VvSoBsaWjwOhmpqIBA.1454726407284.3&ei=9Vy1VpauNcTqjwPsrb64BA&emsg=NCSR&noj=1'
    var url = 'https://www.google.com/search?q=' + encodeURIComponent(term) + '&source=lnms&tbm=isch';

    console.log('Searching (index: ' + imageindex + ', with timeout) for: ' + term);

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
                self.scrape(game, system, term, destinationPath, function() {
                    callback();
                    return;
                }, imageindex + 1, delay);
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

                            var originalpath = destinationPath + '/' + system + '/' + game + '/original' + fileext;

                            console.log('downloading image from original source: ' + imageurl);

                            self.download(imageurl, originalpath, function(filename){
                                
                                //show image in console window
                                gm(originalpath).resize(null, 50).setFormat('png').write(destinationPath + '/console.png', function (err) {
                                    if (err) {
                                        //meh. dont really care if console image cant show
                                    } else {

                                        var consoleimage = fs.readFileSync(destinationPath + '/console.png');
                                        console.png(consoleimage);
                                        fs.removeSync(destinationPath + '/console.png');
                                    }

                                    //resize original image
                                    self.resize(originalpath, destinationPath + '/' + system + '/' + game + '/', function(err) {
                                        if (err) {
                                            //in the case of a resize error, take the next result in the image search

                                            //delete this folder on error to try again next time
                                            Main.rmdir(destinationPath + '/' + system + '/' + game, function (err) {
                                                
                                                //if we havent already searched for this image 10 times, try again
                                                if (imageindex < 10) {

                                                    self.scrape(game, system, term, destinationPath, callback, imageindex + 1, delay);
                                                    return;
                                                } else {
                                                    
                                                    console.log('image search exhausted');
                                                    callback()
                                                    return;
                                                }
                                            });
                                        } else {
                                            console.log('this game done!');
                                            callback();
                                            return;
                                        }
                                    }); 
                                });
                            });
                        });
                    } else {

                        //image is x-raw-image, try again
                        self.scrape(game, details, destinationPath, callback, imageindex + 1, delay);
                        return;
                    }
                        
                } else {
                    console.log('skipping. data had no ou attribute? (image url)');
                    callback();
                    return;    
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

GetBoxArt.resize = function(source, destination, callback) {

    var self = this;

    //loop over resizes
    async.eachSeries(self.resizes, function(resize, nextresize) {

        gm(source).resize(resize).setFormat(self.outputFormat).write(destination + resize + '.' + self.outputFormat, function (err) {
            if (err) {
                return nextresize(err)
            }

            console.log(resize + ' resize compelte');
            return nextresize();
        });

    }, function(err) {
        if (err) {
                
            console.log('error in resizes: ' + err);

            callback(true);
            return;
            
        } else {
            callback();
        }
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

module.exports = GetBoxArt;