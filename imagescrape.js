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

const googleImages = require('google-images');
//Browser key 1
var client = googleImages('011110580981838212022:6cvn0m3bpw0', 'AIzaSyAmG26PFFf2lfHaLBnm-S8Nne6n0JwaxNM');

module.exports = new (function() {

    var outputFormat = 'jpg';

	this.Exec = function(system, term, toolsDir, sourcePath, destinationPath, delay, lowerScoreThreshold, higherScoreThreshold, override, opt_height, opt_width, callback) {

        //open source folder (datafiles)
        fs.readdir(sourcePath, function(err, datafiles) {
            if (err) {
                return callback(err);
            }

            //loop over all datafiles
            async.eachSeries(datafiles, function(datafile, nextdatafile) {

                if (system && system + '_master' !== datafile) {
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
                    fs.ensureDir(path.join(destinationPath, system), err => {
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
                                if (content[game].f[content[game].b].rank >= lowerScoreThreshold && content[game].f[content[game].b].rank <= higherScoreThreshold) {
                                    games.push(game);
                                }
                            }

                            //loop over games
                            async.eachSeries(games, function(game, nextgame) {

                                console.log(game);

                                // console.log('----------------------------------------------------');
                                // console.log(game);
                                // console.log(content[game].f[content[game].b]);

                                //first check tp see if a folder already exists in the web folder
                                fs.exists(path.join(destinationPath, system, game), function(exists) {

                                    //if it doesn't exist, scrape google
                                    if (!exists || override == "true") {

                                        Scrape(game, system, term, toolsDir, destinationPath, opt_height, opt_width, function(err) {

                                            return nextgame();

                                        }, undefined, delay);
                                    
                                    } else {

                                        //already exists
                                        console.log(colors.green('    A folder for this game already exists. Override is currently false.'));

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

    var Scrape = function(game, system, term, toolsDir, destinationPath, opt_height, opt_width, callback, imageindex, delay) {

        delay = delay || 2000;
        delay = parseInt(delay, 10);
        imageindex = imageindex || 0;
        
        delay = Math.floor(Math.random() * (delay / 2)) + delay;

        var term = term.replace('[title]', game); //game + ' ' + details.searchname + ' box';
    
        //some I used for testing
        //var url2 = 'https://www.google.com/search?biw=2156&bih=1278&tbm=isch&sa=1&q=' + encodeURIComponent(term) + '&oq=Nes+Advanced+Dungeons+%26+Dragons+-+Heroes+of+the+Lance+box+front&gs_l=img.12...0.0.1.2801486.0.0.0.0.0.0.0.0..0.0....0...1c..64.img..0.0.0.L9RpRHCeZw0&bav=on.2,or.&bvm=bv.113370389,d.cGc&dpr=2&ech=1&psi=e1y1VvSoBsaWjwOhmpqIBA.1454726407284.3&ei=9Vy1VpauNcTqjwPsrb64BA&emsg=NCSR&noj=1'
        //var url = 'https://www.google.com/search?q=' + encodeURIComponent(term) + '&source=lnms&tbm=isch';
    
        var url; 
    
        if (opt_height && opt_width) {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(term) + '&rlz=1C5CHFA_enUS753US755&biw=1548&bih=887&tbm=isch&source=lnt&tbs=isz:ex,iszw:' + opt_width + ',iszh:' + opt_height;
        }
        else {
            //boxart falls here
            url = 'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1223&bih=782&q=' + encodeURIComponent(term) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi89tOMoezKAhVT22MKHWQDBxYQ_AUIBygB&biw=2156&bih=1322&tbm=isch&tbs=isz:lt,islt:qsvga';
        }
    
        console.log(colors.green('    Search starting for term "' + term + '" at index: ' + imageindex + '...'));
        //console.log('url: ' + url3);
        

        console.log(colors.magenta('    Delaying search by ' + delay + 'ms...'));
        setTimeout(function() {
    
            request({
                method: 'get',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36',
                    'cookie': 'GoogleAccountsLocale_session=en; S=account-recovery=MCt3U61J3-E; GMAIL_RTT=182; HSID=ARVz5NCfn52eqb_ub; SSID=A7rElgXRBWYbJTfXq; APISID=aic2tHALxAW3Ynru/AhGw7itqp8touweRq; SAPISID=b8Ot5ibnYd6ZhokD/AtB2nGAteUEJeDg5W; OGPC=5061900-2:5061918-5:; SID=DQAAANABAADd5gfVpq5IqqXGzLH9o2WoPCIa-li9LNHLfF1V56tvBHEyIM7UVVAUbCKGuVuCIxiT5GDUA-UFCkW-QjqIhdQHBhdTtTBWUd1NdExfntxtxBHNdI3PFKP-DAt6QtyYPbSN8r-gPwKrY7zACF4Fn992H27baHTfzo0r6husIrxzmm5FgqGZ7rLAlxXGCX-uNzFY89-fSKXVLQmsi3IZx0ryMVtzN2gayVWfFVMzNUeglMDAhEKCcV_z7SKeXbCWB1JtRrWiRwBCfeXJ_z8X9_LnKvtZOpOfUU4QfQpvZM00AD_DYtTciEsz5ci6z0BDeK8r_awnDhCdlxr8hG5KN4lgq3Hq2sgNGwJBZr2k4Fb944RNNH_oUV8fxU_LHO5AxN-NrqXm2fFTfkDKUHFhve1qDCRfMyf0IE5VXJvPG-jK6WMTV0h5gSE1uVHiMSzTZNh5kU4c_c63q2TRixqAWaTfqLTM3KaEOoaRj18tgTCcfHIR8jFaIRo37mdCHDJShPZMhsJvQHageUNNfdZ8yPEcyWJR9-uSqPjhjcplO4v5PIy50gnHTtjjP6PkoUxNXEUQI8OrOkVLG1R3wz-9oLqP_1UWePeASrZ9KHIKoVdYZQ; NID=76=CXFxLu0ZNF4gLyMxwRHV8M8P_-xzklRYgIdadt9VtSRn2_J-eFAnGPPA4K3oE2PblyYS2ZBs9qzUoxi435x_plz38bRp-qtCbcglEGwLpEgdl107UPe5h62lCx9dUn3IrD356JmyeYEtzPV3FZjKS77C2mBvravJ5U04642nfxnjLub20KBXJM0daNrLlFOKCbsFnNjMjypYwWvy8My1tkYitQR3Hq1UWqSCY9sYqhOx5P9jvGFUI2MLsJ9yA8z4-hwX6ti5GZ2lqq_-e0FVHUKjGvMeuqc; DV=Yp9juRp9tiseWsea3aFNK64afBBhpQI'
                },
                timeout: 20000
            }, function(err, response, body) {
                if (err) {
                    console.log(colors.red('    There was an error with the request: ' + err));
                    Scrape(game, system, term, toolsDir, destinationPath, opt_height, opt_width, callback, imageindex + 1, delay);
                    return;
                }
                
                console.log(colors.green('    Search returned successfully. Parsing for image index ' + imageindex + '...'));
    
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
                            
                            console.log(colors.green('    Image found in html...'));

                            //create a target folder
                            Main.createFolder(destinationPath + '/' + system + '/' + game, true, function(err) {
                                if (err) {
                                    return callback(err);
                                }
    
                                var originalpath = destinationPath + '/' + system + '/' + game + '/downloaded' + fileext;
                                
                                console.log(colors.green('    Downloading image from original source...'));
    
                                Download(imageurl, originalpath, function(filename){
                                    
                                    //show image in console window
                                    gm(originalpath).resize(null, 80).setFormat('png').write(destinationPath + '/console.png', function (err) {
                                        if (err) {
                                            //meh. dont really care if console image cant show
                                        } else {
    
                                            var consoleimage = fs.readFileSync(destinationPath + '/console.png');
                                            console.png(consoleimage);
                                            fs.removeSync(destinationPath + '/console.png');
                                        }
    
                                        //after scrape, save downloaded image in the format we work with
                                        ConvertImageOnObtain(toolsDir, originalpath, path.join(destinationPath, system, game), true, function(err) {
                                            if (err) {
                                                console.log('Error in saving downloaded image: ' + err);
                                            }
    
                                            //console.log('Deleting downloaded image');
    
                                            fs.unlink(originalpath, function(err) {
                                                if (err) {
                                                    console.log(colors.red('    Error deleting downloaded image'));
                                                }
    
                                                console.log(colors.blue('    "' + term + '" complete...\n\n'));
                                                return callback();
    
                                            });
                                        });
                                    });
                                });
                            });
                        } else {
    
                            //image is x-raw-image, try again
                            Scrape(game, system, term, toolsDir, destinationPath, opt_height, opt_width, callback, imageindex + 1, delay);
                            return;
                        }
                            
                    } else {
                        console.log(colors.red('    Skipping. data had no ou attribute? (image url)'));
                        return callback();
                    }
    
                } else {
                    console.log(colors.red('    Skipping. No anchors in response? Google may have caught on... ' + anchors));
                    return callback();
                }
            });
    
        }, delay);
    };

    this.Uploaded = function(toolsDir, file, destinationPath, callback) {
    
        Main.createFolder(destinationPath, false, function(err) {
            if (err) {
                return callback(err);
            }
    
            //cleanout dir
            Main.emptydir(destinationPath, function(err) {
                if (err) {
                    return callback(err);
                }
    
                ConvertImageOnObtain(toolsDir, file.path, destinationPath, true, function(err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback();
                });
            });
        });
    };
    
    var Download = function(uri, filename, callback){
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

    this.Modulate = function(imagePath, b, s, h, callback) {

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

    var ConvertImageOnObtain = function(toolsDir, sourceImage, destinationPath, autoTone, callback) {
    
        //after scrape, save downloaded image in the format we work with
        gm(sourceImage).setFormat(outputFormat).write(destinationPath + '/original.' + outputFormat, function (err) {
            if (err) {
                return callback(err);
            }
    
            //autotone this image? (come on, say yes!!)
            if (false) {
                exec(toolsDir + 'autotone "' + destinationPath + '/original.' + outputFormat + '" "' + destinationPath + '/original.' + outputFormat + '"', function (err, stdout, stderr) {
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

    var UpdateMeta = function(datafileSource, title, topsuggestion, callback) {

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
                    
                    datafile[title].t = topsuggestion;
                }
                else {
                    delete datafile[title].ts;
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

});
