const express = require('express');
const router = express.Router();
const config = require('config');
const path = require('path');

const Main = require('../main');
const SortContent = require('../emumovies/sortcontent');

const masterFilesRoot = Main.getPath('datafiles');
const emumoviesRoot = Main.getPath('emumovies');
const destinationRoot = Main.getPath('emumoviesready');

router.get('/', function(req, res, next) {
	res.render('emumovies', { 
		title: 'Parse Emu Movies Content'
	});
});

router.get('/sortcontent', function(req, res, next) {

    var system = req.query.system;
    var folder = req.query.folder;
    var fileType = req.query.type; //jpg, mp4
    var usefile = req.query.bestrom;
    
    if (!system) {
        return res.status(400).json('system is a required param');
    }
    if (!folder) {
        return res.status(400).json('folder is a required param');
    }
    if (!fileType) {
        return res.status(400).json('fileType is a required param');
    }

    //form paths
    var masterfile = path.join(masterFilesRoot, system + '_master');
    var sourceFolder = path.join(emumoviesRoot, folder);
    var destinationFolder = path.join(destinationRoot, folder);
    var workingFolder = path.join(destinationRoot, folder + '_unknown')

    SortContent.Exec(masterfile, fileType, sourceFolder, destinationFolder, usefile, workingFolder, err => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json('complete');
    });
});

module.exports = router;