var fs = require('fs-extra');
var async = require('async');
var Main = require('./main.js');

RomFolders = function() {
};

/**
 * takes a folder of single rom files and puts them in an appropriately named folder
 * this was important with some GoodMerged sets as unzipping some yielded in single files instead of a folder
 * for crazyerics we want to build search querys from the name of the game (its folder name) so this function
 * converts those files into game name folders
 * @param  {sting}   system
 * @param  {Function} callback
 * @return {}
 */
RomFolders.exec = function(sourcePath, destinationPath, callback) {

    var datafile = {};

    //open source folder
    fs.readdir(sourcePath, function(err, romfiles) {
        if (err) {
            return callback(err);
        }

        //loop over all file contents
        async.eachSeries(romfiles, function(romfile, nextromfile) {

            fs.stat(sourcePath + '/' + romfile, function(err, stats) {
                
                //bail if anything but a file
                if (stats.isFile()) {

                    if (romfile === '.DS_Store') {
                        nextromfile();
                        return;
                    }
                        
                    //add to remove year: .replace(/\(\d{2}[a-z0-9]{0,2}\)/g,'')
                    //used for lynx

                    //remove file extenstions, anything in brackets 
                    var dirname = romfile.replace(/\..{2,3}$/i,''); //remove extensions
                    dirname = dirname.replace(/\(.{1}\)/g,''); //remove periods
                    dirname = dirname.replace(/\[.*\]/g,''); //remove everything in brackets
                    dirname = dirname.replace(/\(\d{2}[a-z0-9]{0,2}\)/g,''); //remove year (1999) or (199x) or (19xx)
                    dirname = dirname.replace(/\s{2,}/g,' '); //remove any double spacing
                    dirname.trim();

                    //passing false to second param says NOT to overwrite on exist
                    Main.createFolder(destinationPath + '/' + dirname, false, function(err) {
                        if (err) {
                            return callback(err);
                        }

                        //read file
                        fs.readFile(sourcePath + '/' + romfile, function(err, buffer) {
                            if (err) {
                                return callback(err);
                            }

                            fs.writeFile(destinationPath + '/' + dirname + '/' + romfile, buffer, function(err) {
                                if (err) {
                                    return nextfolder(err);
                                }

                                console.log(romfile + ' ---> ' + dirname);

                                nextromfile();
                            }); 
                        });
                    });
                }
            });

        }, function(err, result) {

            if (err) {
                return callback(err);
            }
            callback(null, '');
        });
    });

};

module.exports = RomFolders;