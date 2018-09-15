'use strict';
const fs = require('fs-extra');
const async = require('async');
const path = require('path');
const colors = require('colors');
const stringScore = require('string-score');

module.exports = new (function() {

    const _self = this;
    var titles = [];

    this.Exec = function(masterfilePath, fileType, sourceFolder, destinationFolder, usefile, workingFolder, callback) {
        
        //empty destinations
        fs.emptyDir(destinationFolder, err => {
            if (err) return callback(err);

            //copy all files to a working directory
            fs.copy(sourceFolder, workingFolder, err => {
                if (err) return callback(err);

                //open the data file
                fs.readJson(masterfilePath, (err, masterfile) => {
                    if (err) return callback(err);

                    //create array of titles
                    for (var title in masterfile) {

                        //if (title == 'About Advanced Dungeons & Dragons - Heroes of the Lance (PD)') debugger;

                        //filter based on score
                        var rank = masterfile[title].f[masterfile[title].b].rank;

                        if (rank >= 250) {
                            titles.push(title);
                        }
                    }

                    //open source folder
                    fs.readdir(sourceFolder, function(err, contents) {
                        if (err) return callback(err);

                        
                        LoopFiles(contents, 0, {}, (err, bestFileForTitle) => {
                            if (err) return callback(err);

                            //loop over all best file matches
                            async.eachOfSeries(bestFileForTitle, function(value, key, nextTitle) {
                                
                                var destination = path.join(destinationFolder, key);
                                if (usefile ==  'true') {
                                    destination = path.join(destination, masterfile[key].b);
                                }
                                
                                var sourceFile = path.join(workingFolder, value.file);
                                var destinationFile = path.join(destination, '0.' + fileType);
                                var destinationInfo = path.join(destination, 'info.json');

                                var data = {
                                    'originalfile': value.file,
                                    'dateprocessed': Date.now(),
                                    'notes': ''
                                };


                                //MOVE files out of working folder, this leaves unknown files in the working folder
                                fs.move(sourceFile, destinationFile, err => {
                                    if (err) return callback(err)

                                    //write data file
                                    fs.writeJSON(destinationInfo, data, err => {
                                        if (err) return callback(err);

                                        return nextTitle();
                                    });
                                });

                            }, err => {
                                if (err) return callback(err);

                                callback();
                            });
                        });
                    });
                });
            });
        });
    };


    // if ((result.target == result3.target) && (content == result2.target))
    //                         {
    //                             console.log('agree\n');

    //                             //if so, copy the file to the destination
    //                             //write to file
    //                             var sourceFile = path.join(sourceFolder, content);
    //                             var destinationFile = path.join(destinationFolder, result.target, '0.jpg');

    //                             fs.copy(sourceFile, destinationFile, err => {
    //                                 if (err) return callback(err)

    //                                 nextcontent();
    //                             });
    //                         }
    //                         else {
    //                             console.log(colors.red('disagree\n'));

    //                             //if they disagree, move the file to a remainders location
    //                             //write to file
    //                             var sourceFile = path.join(sourceFolder, content);
    //                             var destinationFile = path.join(leftOversFolder, content);

    //                             fs.copy(sourceFile, destinationFile, err => {
    //                                 if (err) return callback(err)

    //                                 nextcontent();
    //                             });
    //                         }

    var LoopFiles = function(contents, scoreIndex, bestFileForTitle, callback) {

        var again = [];

        //loop over all files in source
        async.eachSeries(contents, function(content, nextcontent) {
            
            //doctor file name since emumovies tends to add stuff not needed
            var file = path.parse(content);
            var searchTerm = file.name;
            searchTerm = searchTerm.replace(/\(.*\)/g, '');

            if (scoreIndex > 0) {
                searchTerm = searchTerm.replace('II', '2');
            }

            var scores = getScores(searchTerm, titles); //get scores of all titles for this file
            var title = scores[scoreIndex].target;
            var score = scores[scoreIndex].score;

            //if (content === 'Zoda\'s Revenge - StarTropics II (USA).mp4') debugger;


            if (score <= 0.5) {
                console.log('file: ' + content + ' -> best matches title: ' + title + ' but too low scoring at ' + score);
                return nextcontent();
            }

            if (!bestFileForTitle[title]) {
                bestFileForTitle[title] = {
                    file: content,
                    score: score
                };

                console.log(colors.blue('file: ' + content + ' -> matches title: ' + title + ' ' + score));
            }
            else {
                if (bestFileForTitle[title].score < score) {
                    
                    //if the previous file match now fails, add it to the end to try again later
                    var original = bestFileForTitle[title].file;
                    again.push(original);

                    bestFileForTitle[title] = {
                        file: content,
                        score: score
                    };

                    console.log(colors.magenta('file: ' + content + ' -> BETTER matches title: ' + title + ' ' + score + '. The old file: ' + original + ' will go again'));
                }
                else {
                    console.log(colors.red('file: ' + content + '\'s best match was ' + title + '. BUT Its score of ' + score + ' is less than file already set: ' + bestFileForTitle[title].file + ' ' + bestFileForTitle[title].score + '. Will try its next match'));
                    again.push(content);
                }
            }

            nextcontent();

        }, function(err, result) {
            if (err) return callback(err);

            if (again.length > 0 && scoreIndex < 2) {
                LoopFiles(again, scoreIndex + 1, bestFileForTitle, callback);
            }
            else {
                callback(null, bestFileForTitle);
            }
        });
    }


    var getScores = function(term, collection) {

        var scores = [];
        var i = 0; 
        var len = collection.length;

        //record scores for all in collection
        // for (i; i < len; ++i) {
        //     scores.push({
        //         target: collection[i],
        //         score: stringScore(term, collection[i], 0.5)
        //     });
        // }

        var termwords = term.trim().split(' ');

        //for all in haystack
        for (i; i < len; ++i) {

            var sum = 0;
            var collectionwords = collection[i].split(' ');
            
            for(var j = 0; j < termwords.length; ++j) {

                var foundterm = false;

                for (var k = 0; k < collectionwords.length; ++k) {

                    if (termwords[j].toLowerCase() == collectionwords[k].toLowerCase())
                    {
                        foundterm = true;
                    }
                    
                }

                if (foundterm) {
                    sum += 1;
                } else {
                    sum -= 0.5;
                }
            }

            if (collectionwords.length > termwords.length) {
                sum -= (collectionwords.length - termwords.length) * 0.2;
            }

            var score = sum / termwords.length;

            scores.push({
                target: collection[i],
                score: score
            })
        }

        

        scores.sort(function(a, b){
            return b.score - a.score;
        });

        return scores;
    };
});