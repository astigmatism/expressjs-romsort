var express = require('express');
var fs = require('fs-extra');
var async = require('async');
var Main = require('../main');
var Decompress = require('../decompress');
var CompressFiles = require('../compressfiles');
var AlphaSort = require('../alphasort');
var TopChoice = require('../topchoice');
var CDNReady = require('../cdnready');
var DataFile = require('../datafile');
var RomFolders = require('../romfolders');
var GetBoxArt = require('../getboxart');
var CDNBoxReady = require('../cdnboxready');
//var NeoGeoRename = require('../neogeorename');
var TheGamesDB = require('../thegamesdb');
var TheGamesDBPics = require('../thegamesdbpics');
var CompressShaders = require('../compressshaders');
var MakeAllShaders = require('../makeallshaders');
var multer  = require('multer');
var upload = multer( { dest: '../public/uploads/' } );
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Express' 
	});


});

var folders = {
	starthere: 			__dirname + '/../workspace/00 - starthere/',
	decompressed: 		__dirname + '/../workspace/99 - decompressed/',
	compressedfiles: 	__dirname + '/../workspace/02 - compressedfiles/',
	hacksorted: 		__dirname + '/../workspace/03 - hacksorted/',
	alphasorted:		__dirname + '/../workspace/04 - alphasorted/',
	topchoice: 			__dirname + '/../workspace/05 - topchoice/',
	data: 				__dirname + '/../workspace/06 - datafile/',
	romfiles: 			__dirname + '/../workspace/07 - romfiles/',
	romfolders: 		__dirname + '/../workspace/08 - romfolders/',
	boxart:				__dirname + '/../workspace/09 - boxart downloads/',
	shaderfiles: 		__dirname + '/../workspace/10 - shaderfiles/',
	allshaders: 		__dirname + '/../workspace/11 - allshaders/',
	cgshaders: 			__dirname + '/../workspace/12 - cgshaders/',
	glsl: 				__dirname + '/../workspace/13 - glsl/',
	thegamesdbpics: 	__dirname + '/../workspace/14 - thegamesdbpics/',
	ready: 				__dirname + '/../workspace/ready/',
	cdnboxready:		__dirname + '/../workspace/cdnboxready/',
	cdnready: 			__dirname + '/../workspace/98 - cdnready/',
	webboxart: 			__dirname + '/../public/boxart/',
	cdnshaderready: 	__dirname + '/../workspace/cdnshaderready/',
	config: 		 	__dirname + '/../config/'
};

/**
 * This end point is going to take a folder with a bunch of 7z files and extact them
 * This is the typical storage routine for GoodMerge sets
 */
router.get('/decompress', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder) {
		return res.json('system is a required query param');
	}

	Decompress.exec(folders.starthere + folder, folders.decompressed + folder, function(err, data) {
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
		return res.json('filter is a required query param: zip|7z');

	CompressFiles.exec(folders.decompressed + folder, folders.compressedfiles + folder, compressiontype, filter, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/alphasort', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	AlphaSort.exec(folders.compressedfiles + folder, folders.alphasorted + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/romfolders', function(req, res, next) {

	RomFolders.exec(folders.romfiles, folders.romfolders, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/neogeorename', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder) {
		return res.json('system is a required query param');
	}

	NeoGeoRename.exec(folders.config + 'mame179dat.json', folders.starthere + folder, folders.decompressed + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/hacksort/:folder', function(req, res, next) {
	
	var folder = req.params.folder;

	AlphaSort.sortHacks(folders.hacksorted + folder, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/datafile', function(req, res, next) {
	
	var folder = req.query.system;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');

	DataFile.exec(folders.decompressed + folder, folders.data + '/' + folder + '.json', function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/datafile/boxart', function(req, res, next) {

	var folder = req.query.system;

	if (!folder)
		return res.json('system is a required query param. Maps to folder name (gen, snes, n64, gb...)');
		
	DataFile.boxart(folders.data + '/' + folder + '.json', folders.webboxart + folder, folders.data + '/' + folder + '_boxart.json', function(err, result) {
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

	TopChoice.exec(folders.decompressed + folder, folders.topchoice + folder, flatten, function(err, data) {
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

	source = source === "topchoice" ? folders.topchoice + folder : folders.decompressed + folder;

	CDNReady.exec(source, folders.cdnready + folder, segmentsize, function(err, data) {
		if (err) {
            return res.json(err);
        }
        res.json(data);
	});
});

router.get('/cdnboxready/:folder', function(req, res, next) {

	var folder = req.params.folder;	

	CDNBoxReady.exec(folders.data + '/' + folder + '.json', folders.webboxart  + folder, folders.cdnboxready + folder, function(err, data) {
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

	GetBoxArt.exec(system, term, folders.data, folders.boxart, folders.webboxart, delay, function(err, data) {
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

	TheGamesDB.exec(system, score, update, folders.data, folders.data + '/' + system + '_thegamesdb.json', folders.data + '/' + system + '_thegamesdb_report.json', function(err, data){
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

	TheGamesDBPics.exec(system, folders.data + '/' + system + '_thegamesdb.json', folders.thegamesdbpics, function(err, data){
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
	fs.readdir(folders.webboxart + system, function(err, webtitles) {
        if (err) {
        	console.log(err);
            return res.json(err);
        }

        //get contents of data file
        fs.readJson(folders.data + '/' + system + '.json', function(err, datafile) {
	        if (err) {
	            return callback(err);
	        }

	        res.render('boxart', {
		    	data: JSON.stringify(datafile),
		    	webtitles: JSON.stringify(webtitles),
		    	system: system
			});
		});
    });
});

router.delete('/boxart', function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;

	Main.rmdir(folders.webboxart + '/' + system + '/' + title, function(err) {
		if (err) {
			console.log(err);
			res.json(err);
		}
		res.json();
	});
});

router.post('/boxart', upload.single( 'file' ), function(req, res, next) {

	var system = req.body.system;
	var title = req.body.title;
	var path = folders.webboxart + '/' + system + '/' + title;

	Main.createFolder(path, false, function(err) {
		if (err) {
			console.log(err);
			return res,json(err);
		}

		//cleanout dir
		Main.emptydir(path, function(err) {
			if (err) {
				return res.json(err);
			}
			
			fs.rename(req.file.path, path + '/original.jpg', function(err) {
				if (err) {
					return res.json(err);
				}

				res.json(req.file);
			});
		});
	});
});

router.get('/makeshader/:name', function(req, res, next) {

	var name = req.params.name;

	fs.emptyDir(folders.cdnshaderready, function (err) {

		CompressShaders.exec(name, folders.shaderfiles, folders.cdnshaderready, function(err, data) {
			if (err) {
	            return res.json(err);
	        }
	        res.json(data);
		});
	});
});

router.get('/makeallshaders', function(req, res, next) {

	fs.emptyDir(folders.shaderfiles, function (err) {

		MakeAllShaders.exec(folders.allshaders, folders.shaderfiles, folders.cgshaders, folders.cdnshaderready, function(err, data) {
			if (err) {
	            return res.json(err);
	        }
	        res.json(data);
		});

	});
});

router.get('/glsl', function(req, res, next) {

	fs.emptyDir(folders.glsl, function (err) {

		MakeAllShaders.glslFlatten(folders.allshaders, folders.glsl, function(err, data) {
			if (err) {
	            return res.json(err);
	        }
	        res.json(data);
		});
	});
});

module.exports = router;
