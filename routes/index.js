var express = require('express');
var fs = require('fs-extra');
var async = require('async');
var Main = require('../main');
var Decompress = require('../decompress');
var CompressFiles = require('../compressfiles');
var AlphaSort = require('../alphasort');
var TopChoice = require('../topchoice');
var CDNReady = require('../cdnready');
var MasterFile = require('../masterfile');
var RomFolders = require('../romfolders');
var GetBoxArt = require('../getboxart');
var CDNBoxReady = require('../cdnboxready');
var UploadToDropBox = require('../uploadtodropbox.js');
var SupportFiles = require('../supportfiles.js');
//var NeoGeoRename = require('../neogeorename');
var TheGamesDB = require('../thegamesdb');
var TheGamesDBPics = require('../thegamesdbpics');
var CompressShaders = require('../compressshaders');
var MakeAllShaders = require('../makeallshaders');
var RenameSPCFolder = require('../renamespcfolder');
var multer  = require('multer');
var upload = multer( { dest: '../public/uploads/' } );
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Express' 
	});
});

/**
 * This end point is going to take a folder with a bunch of 7z files and extact them
 * This is the typical storage routine for GoodMerge sets
 */
router.get('/decompress', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder) {
		return res.json('system is a required query param');
	}

	Decompress.exec(Main.getPath('start') + folder, Main.getPath('decompressed') + folder, function(err, data) {
		if (err) {
			console.log(err);
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/compressfiles', function(req, res, next) {
	
	var folder = req.query.system;
	var compressiontype = req.query.compression;
	var filter = req.query.filter;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!compressiontype)
		return res.json('compression is a required query param: zip|7z');
	if (!filter)
		return res.json('filter is a required query param: verified|none');

	CompressFiles.exec(Main.getPath('decompressed') + folder, Main.getPath('compressed') + folder, compressiontype, filter, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/alphasort', function(req, res, next) {
	
	var folder = req.query.system;
	var source = req.query.source;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!source)
		return res.json('source is a required query param: compressed|decompressed');

	AlphaSort.exec(Main.getPath(source) + folder, Main.getPath('alphasorted') + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/romfolders', function(req, res, next) {

	RomFolders.exec(Main.getPath('romfiles'), Main.getPath('romfolders'), function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/clearromfolders', function(req, res, next) {

	Main.emptydir(Main.getPath('romfiles'), function(err) {
		if (err) {
			console.log(err);
		}
		Main.emptydir(Main.getPath('romfolders'), function(err) {
			if (err) {
				console.log(err);
			}
			return res.json({});
		});
	});
	
});

router.get('/neogeorename', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder) {
		return res.json('system is a required query param');
	}

	NeoGeoRename.exec(Main.getPath('config') + 'mame179dat.json', Main.getPath('start') + folder, Main.getPath('decompressed') + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/hacksort/:folder', function(req, res, next) {
	
	var folder = req.params.folder;

	AlphaSort.sortHacks(Main.getPath('hacksorted') + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/masterfile', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	MasterFile.exec(folder, Main.getPath('decompressed') + folder, Main.getPath('datafiles') + '/' + folder + '_master', function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/masterfile/boxart', function(req, res, next) {

	var folder = req.query.system;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
		
	MasterFile.boxart(Main.getPath('datafiles') + '/' + folder + '_master', Main.getPath('webboxart') + folder, Main.getPath('datafiles') + '/' + folder + '_boxart', function(err, result) {
		if (err) {
			return res.json(err);
		}
		res.json(result);
	});
});

router.get('/topchoice', function(req, res, next) {
	
	var folder = req.query.system;
	var flatten = req.query.flatten === "true" ? true : false;

	if (!folder)
		return res.json('system is a required query param');

	TopChoice.exec(Main.getPath('decompressed') + folder, Main.getPath('topchoice') + folder, flatten, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/cdnready', function(req, res, next) {
	
	var folder = req.query.system;
	var source = req.query.source;
	var segmentsize = req.query.segmentsize || 25000000;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!source)
		return res.json('source is a required query param. topchoice|decompressed');

	source = source === "topchoice" ? Main.getPath('topchoice') + folder : Main.getPath('decompressed') + folder;

	CDNReady.exec(source, Main.getPath('cdnready') + folder, Main.getPath('datafiles') + '/' + folder + '_filedata', segmentsize, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/supportfiles', function(req, res, next) {

	var system = req.query.system;
	var segmentsize = req.query.segmentsize || 25000000;

	SupportFiles.exec(system, segmentsize, Main.getPath('supportfiles'), Main.getPath('cdnsupportready'), function(err, response) {
		if (err) {
			return res.json(err);
		}
		res.json(response);
	});
});

router.get('/cdnboxready/:folder', function(req, res, next) {

	var folder = req.params.folder;	

	CDNBoxReady.exec(Main.getPath('datafiles') + '/' + folder + '_master', Main.getPath('webboxart')  + folder, Main.getPath('cdnboxready') + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/getboxart', function(req, res, next) {

	var system = req.query.system;
	var term = req.query.term;
	var delay = req.query.delay || 2000; //delay between searching
	var lowerThreshold = req.query.lower || 250;
	var higherThreshold = req.query.upper || 500;
	var override = req.query.override;

	GetBoxArt.exec(system, term, Main.getPath('tools'), Main.getPath('datafiles'), Main.getPath('webboxart'), delay, lowerThreshold, higherThreshold, override, function(err, data) {
		if (err) {
			console.log(err);
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/thegamesdb', function(req, res, next) {

	var system = req.query.system;
	var score = req.query.score || 0.15; //default is low. since we compare score to all other possibilities, it doesnt need to be high
	var update = req.query.update;

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!update)
		return res.json('update is a required query param: all|missing|empty|[title]. title is specific to entry in datafile. continue walks datafile and fills in entries not included. missing updates all entries which did not return data the last time. all will walk datafile and update all entries.');

	score = parseFloat(score);

	TheGamesDB.exec(system, score, update, Main.getPath('datafiles') + '/' + system + '_master', Main.getPath('datafiles') + '/' + system + '_thegamesdb', Main.getPath('datafiles') + '/' + system + '_thegamesdb_report.json', function(err, data){
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/thegamesdbpics', function(req, res, next) {

	var system = req.query.system;
	var update = req.query.update;

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	TheGamesDBPics.exec(system, Main.getPath('datafiles') + '/' + system + '_thegamesdb.json', Main.getPath('thegamesdbpics'), function(err, data){
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/boxart/:system', function(req, res, next) {

	var system = req.params.system;
	var alpha = req.query.alpha;

	//read all titles from web folder
	fs.readdir(Main.getPath('webboxart') + system, function(err, webtitles) {
        if (err) {
        	console.log(err);
            return res.json(err);
        }

        //get contents of data file
        fs.readJson(Main.getPath('datafiles') + '/' + system + '_master', function(err, masterFile) {
	        if (err) {
	            return callback(err);
	        }

			//get contents of the boxart data file, if exists!
			fs.exists(Main.getPath('datafiles') + '/' + system + '_boxart', function(exists) {

				var onComplete = function(boxartdata) {

					res.render('boxart', {
						data: JSON.stringify(masterFile),
						webtitles: JSON.stringify(webtitles),
						system: system,
						boxartdata: JSON.stringify(boxartdata)
					});
					return;
				};

				if (exists) {
					
					fs.readJson(Main.getPath('datafiles') + '/' + system + '_boxart', function(err, boxartdatafile) {
						if (err) {
							return callback(err);
						}
						return onComplete(boxartdatafile);
					});
				}
				else {
					return onComplete();
				}
			});
		});
    });
});

router.patch('/boxart', function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;
	var b = req.body.b;
	var s = req.body.s;
	var h = req.body.h;

	GetBoxArt.modulate(Main.getPath('webboxart') + '/' + system + '/' + title + '/original.jpg', b, s, h, function(err) {
		if (err) {
			console.log(err);
			return res.json(err);
		}
		res.json();
	});
});

router.delete('/boxart', function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;

	Main.rmdir(Main.getPath('webboxart') + '/' + system + '/' + title, function(err) {
		if (err) {
			console.log(err);
			return res.json(err);
		}
		res.json();
	});
});

router.post('/boxart', upload.single( 'file' ), function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;

	GetBoxArt.uploaded(Main.getPath('tools'), req.file, Main.getPath('webboxart') + '/' + system + '/' + title, function(err) {
		if (err) {
			return res.json(err);
		}
		res.json(req.file);
	});
});

router.post('/boxart/meta', function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;
	var topsuggestion = req.body.topsuggestion;

	//read system data file
	GetBoxArt.updateMeta(Main.getPath('datafiles') + '/' + system + '_boxart', title, topsuggestion, function(err) {
        if (err) {
            return callback(err);
        }
		res.json();
	});
});

router.get('/makeshader/:name', function(req, res, next) {

	var name = req.params.name;

	fs.emptyDir(Main.getPath('cdnshaderready'), function (err) {

		CompressShaders.exec(name, Main.getPath('shaderfiles'), Main.getPath('cdnshaderready'), function(err, data) {
			if (err) {
	            return res.json(err);
	        }
	        res.json(data);
		});
	});
});

router.get('/makeallshaders', function(req, res, next) {

	fs.emptyDir(Main.getPath('shaderfiles'), function (err) {

		MakeAllShaders.exec(Main.getPath('allshaders'), Main.getPath('shaderfiles'), Main.getPath('cgshaders'), Main.getPath('cdnshaderready'), function(err, data) {
			if (err) {
	            return res.json(err);
	        }
	        res.json(data);
		});

	});
});

router.get('/glsl', function(req, res, next) {

	fs.emptyDir(Main.getPath('glsl'), function (err) {

		MakeAllShaders.glslFlatten(Main.getPath('allshaders'), Main.getPath('glsl'), function(err, data) {
			if (err) {
	            return res.json(err);
	        }
	        res.json(data);
		});
	});
});

router.get('/spcrename', function(req, res, next) {

	RenameSPCFolder.exec(Main.getPath('spcs'), Main.getPath('spcsready'), function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/dropbox/roms', function(req, res, next) {

	var system = req.query.system;
	var cdnversion = req.query.version;

	UploadToDropBox.roms(system, cdnversion, Main.getPath('cdnready') + system, function(err, response) {
		if (err) {
            return res.json(err);
        }
        res.json(response);
	});
});

router.get('/dropbox/boxes', function(req, res, next) {

	var system = req.query.system;
	var cdnversion = req.query.version;

	UploadToDropBox.boxes(system, cdnversion, Main.getPath('cdnboxready') + system, function(err, response) {
		if (err) {
            return res.json(err);
        }
        res.json(response);
	});
});

module.exports = router;
