var express = require('express');
var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var Main = require('../main');
var Decompress = require('../decompress');
var Compress = require('../compress');
var Mame = require('../mame');
var AlphaSort = require('../alphasort');
var TopChoice = require('../topchoice');
var CDNReady = require('../cdnready');
var CDNImages = require('../cdnimages')
var MasterFile = require('../masterfile');
var RomFolders = require('../romfolders');
var ImageScrape = require('../imagescrape');
var ImageMasterFile = require('../imagemasterfile');
var CDNBoxReady = require('../cdnboxready');
var SupportFiles = require('../supportfiles.js');
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

router.get('/images', function(req, res, next) {
	res.render('images', { 
		title: 'Parse EmuMovies Content' 
	});
});

router.get('/cdn', function(req, res, next) {
	res.render('cdn', { 
		title: 'Prepare CDN content' 
	});
});

/**
 * This end point is going to take a folder with a bunch of 7z files and extact them
 * This is the typical storage routine for GoodMerge sets
 */
router.get('/decompress', function(req, res, next) {
	
	var folder = req.query.system;
	var scanOnly = req.query.scan;

	if (!folder) {
		return res.json('system is a required query param');
	}

	if (scanOnly) {

		Decompress.ProcessTitles(folder, Main.getPath('decompressed') + folder, Main.getPath('decompressed'), function(err, data) {
			if (err) {
				console.log(err);
				return res.json(err);
			}
			res.json(data);
		});
	}
	else {

		Decompress.Exec(folder, Main.getPath('start') + folder, Main.getPath('decompressed') + folder, Main.getPath('decompressed'), function(err, data) {
			if (err) {
				console.log(err);
				return res.json(err);
			}
			res.json(data);
		});
	}
});

router.get('/compress', function(req, res, next) {
	
	var folder = req.query.system;
	var compressiontype = req.query.compression;
	var filter = req.query.filter;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!compressiontype)
		return res.json('compression is a required query param: none|zip|7z');
	if (!filter)
		return res.json('filter is a required query param: 0|1|2');

	var source = path.join(Main.getPath('decompressed'), folder);
	var destination = path.join(Main.getPath('compressed'), folder);

	Compress.Exec(source, destination, compressiontype, filter, (err, data) => {
		if (err) return res.json(err);
        res.json(data);
	});
});

router.get('/mame', function(req, res, next) {
	
	var folder = 'arcade' || 'mame';

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	var source = path.join(Main.getPath('start'), folder);
	var destination = path.join(Main.getPath('decompressed'), folder);

	Mame.Exec(source, destination, (err, data) => {
		if (err) {
			console.log(err);
			return res.json(err);
		}
        res.json(data);
	});
});

router.get('/alphasort', function(req, res, next) {
	
	var folder = req.query.system;
	var source = req.query.source;
	var letterstep = req.query.step;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!source)
		return res.json('source is a required query param: compressed|decompressed');

	var sourceFolder = path.join(Main.getPath(source), folder);	
	var destinationFolder = path.join(Main.getPath('alphasorted'), folder);

	AlphaSort.Exec(sourceFolder,  destinationFolder, letterstep, (err, data) => {
		if (err) return res.json(err);
        res.json(data);
	});
});

router.get('/romfolderbyname', function(req, res, next) {

	var folders = req.query.folders;
	var folder = req.query.system;

	if (!folder) {
		return res.json('system is a required query param');
	}
	
	var sourceFolder = path.join(Main.getPath('decompressed'), folder);
	var workingFolder = Main.getPath('romfiles');

	RomFolders.Exec(sourceFolder, workingFolder, folders, (err) => {
		if (err) {
            return res.json(err);
        }
        res.json('Rom Folders Complete!');
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
		if (err) return res.json(err);
        res.json('complete');
	});
});

router.get('/topchoice', function(req, res, next) {
	
	var folder = req.query.system;
	var lowerlimit = req.query.lowerlimit;
	var flatten = req.query.flatten === "true" ? true : false;
	var source = req.query.source;

	if (!folder)
		return res.json('system is a required query param');
	if (!lowerlimit)
		return res.json('lowerlimit is a required query param');

	var sourceFolder = path.join(Main.getPath(source), folder);

	TopChoice.exec(sourceFolder, Main.getPath('topchoice') + folder, lowerlimit, flatten, function(err, data) {
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
	var cdnromfoldername = req.query.cdnromfoldername;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!source)
		return res.json('source is a required query param. topchoice|decompressed');
	if (!cdnromfoldername)
		cdnromfoldername = folder; //use folder name (a2600)

	source = source === "topchoice" ? Main.getPath('topchoice') + folder : Main.getPath('decompressed') + folder;

	CDNReady.exec(source, Main.getPath('cdnready') + cdnromfoldername, Main.getPath('datafiles') + '/' + folder + '_filedata', segmentsize, function(err, data) {
		if (err) return res.json(err);
        res.json('complete');
	});
});

router.get('/cdnboxready/:folder', function(req, res, next) {

	var folder = req.params.folder;	

	CDNBoxReady.exec(Main.getPath('datafiles') + '/' + folder + '_master', Main.getPath('webboxart')  + folder, Main.getPath('cdnboxready') + folder, function(err, data) {
		if (err) return res.json(err);
        res.json('complete');
	});
});

router.get('/cdnimages', function(req, res, next) {

	var system = req.query.system;
	var folder = req.query.folder;
	var usefile = req.query.file;

	var datafilepath = Main.getPath('datafiles') + '/' + system + '_master';
	var source = path.join(Main.getPath('public'), folder, system);
	var dest = path.join(Main.getPath('cdnimages'), system);

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	CDNImages.Exec(system, folder, usefile, source, dest, datafilepath, (err) => {
		if (err) return res.json(err);
		res.json();
	});

});

router.get('/supportfiles', function(req, res, next) {

	var system = req.query.system;
	var segmentsize = req.query.segmentsize || 25000000;

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	SupportFiles.exec(system, segmentsize, Main.getPath('supportfiles'), Main.getPath('cdnsupportready'), function(err, response) {
		if (err) return res.json(err);
		res.json(response);
	});
});

router.get('/imagescrape', function(req, res, next) {

	var system = req.query.system;
	var term = req.query.term;
	var delay = req.query.delay || 2000; //delay between searching
	var lowerThreshold = req.query.lower || 250;
	var higherThreshold = req.query.upper || 500;
	var height = req.query.height;
	var width = req.query.width;
	var override = req.query.override;
	var folder = req.query.folder;

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!folder)
		return res.json('folder is a required query param. Maps to folder in public to which to save images');
	if (!term)
		return res.json('term is a required query param. How else would you query google image search?');

	var destination = path.join(Main.getPath('public'), folder);

	ImageScrape.Exec(system, term, Main.getPath('tools'), Main.getPath('datafiles'), destination, delay, lowerThreshold, higherThreshold, override, height, width, function(err, data) {
		if (err) return res.json(err);
        res.json(data);
	});
});

router.get('/imagemasterfile', function(req, res, next) {

	var system = req.query.system;
	var folder = req.query.folder;

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!folder)
		return res.json('folder is a required query param. Maps to folder in public to which to save images');


	var masterfile = path.join(Main.getPath('datafiles'), system + '_master');
	var source = path.join(Main.getPath('public'), folder, system);
	var destination = path.join(Main.getPath('datafiles'), system + '_' + folder);

	ImageMasterFile.Exec(masterfile, source, destination, function(err, data) {
		if (err) return res.json(err);
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
		if (err) return res.json(err);
        res.json('complete');
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

router.get('/imagesedit/:system/:folder', function(req, res, next) {

	var system = req.params.system;
	var folder = req.params.folder;
	var threshold = req.query.threshold || 400;
	var fileType = req.query.type || 'jpg';

	if (!system)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
	if (!folder)
		return res.json('folder is a required query param. Maps to folder in public to which to save images');

	var source = path.join(Main.getPath('public'), folder, system);
	var datafile = path.join(Main.getPath('datafiles') + '/' + system + '_master');

	//read all titles from web folder
	fs.readdir(source, function(err, webtitles) {
        if (err) {
        	console.log(err);
            return res.json(err);
        }

        //get contents of data file
        fs.readJson(datafile, function(err, masterFile) {
	        if (err) {
	            return callback(err);
	        }

			res.render('boxart', {
				data: JSON.stringify(masterFile),
				webtitles: JSON.stringify(webtitles),
				system: system,
				folder: folder,
				threshold: threshold,
				fileType: fileType
			});
			return;
		});
    });
});

router.patch('/boxart', function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;
	var folder = req.body.folder;
	var b = req.body.b;
	var s = req.body.s;
	var h = req.body.h;

	var file = path.join(Main.getPath('public'), folder, system, title, '0.jpg');

	GetBoxArt.modulate(file, b, s, h, function(err) {
		if (err) {
			console.log(err);
			return res.json(err);
		}
		res.json();
	});
});

router.delete('/boxart', function(req, res, next) {

	var folder = req.body.folder;
	var system = req.body.system;
	var title = req.body.title;

	Main.rmdir(path.join(Main.getPath('public'), folder, system, title), function(err) {
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
	var folder = req.body.folder;

	var destination = path.join(Main.getPath('public'), folder, system, title);

	ImageScrape.Uploaded(Main.getPath('tools'), req.file, destination, function(err) {
		if (err) {
			return res.json(err);
		}
		res.json(req.file);
	});
});

router.post('/boxart/meta', function(req, res, next) {

	var folder = req.body.folder;
	var system = req.body.system;
	var title = req.body.title;
	var topsuggestion = req.body.topsuggestion;

	//read system data file
	ImageScrape.UpdateMeta(Main.getPath('datafiles') + '/' + system + '_' + folder, title, topsuggestion, function(err) {
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

		MakeAllShaders.exec(Main.getPath('allshaders'), Main.getPath('shaderfiles'), Main.getPath('cdnshaderready'), function(err, data) {
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

router.get('/cleanup', function(req, res, next) {

	var cdnromfoldername = req.query.cdnromfoldername;
	var folder = req.query.system;

	if (!folder) {
		return res.json('system is a required query param');
	}

	Main.rmdir(path.join(Main.getPath('start'), folder), function() {
		Main.rmdir(path.join(Main.getPath('decompressed'), folder), function() {
			Main.rmdir(path.join(Main.getPath('compressed'), folder), function() {
				Main.rmdir(path.join(Main.getPath('topchoice'), folder), function() {
					Main.rmdir(path.join(Main.getPath('cdnready'), cdnromfoldername), function() {
					});
				});
			});
		});
	});
});

module.exports = router;
