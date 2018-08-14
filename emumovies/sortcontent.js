'use strict';
const fs = require('fs-extra');
const async = require('async');
const path = require('path');
const colors = require('colors');
const stringScore = require('string-score');

module.exports = new (function() {

    const _self = this;

    this.Exec = function(masterfilePath, sourceFolder, destinationFolder, workingFolder, callback) {
        
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
                    var titles = [];
                    for (var title in masterfile) {
                        titles.push(title);
                    }

                    //open source folder
                    fs.readdir(sourceFolder, function(err, contents) {
                        if (err) return callback(err);


                        var bestFileForTitle = {};

                        //loop over all files in source
                        async.eachSeries(contents, function(content, nextcontent) {
                            
                            var scores = getScores(content, titles); //get scores of all titles for this file
                            var title = scores[0].target;
                            var score = scores[0].score;

                            if (!bestFileForTitle[title]) {
                                bestFileForTitle[title] = {
                                    file: content,
                                    score: score
                                };
                                console.log(colors.blue('file: ' + content + ' -> matches title: ' + title + ' ' + score));
                            }
                            else {
                                if (bestFileForTitle[title].score < score) {
                                    bestFileForTitle[title] = {
                                        file: content,
                                        score: score
                                    };
                                    console.log(colors.magenta('file: ' + content + ' -> BETTER matches title: ' + title + ' ' + score));
                                }
                                else {
                                    console.log(colors.red('file: ' + content + ' does not better match title: ' + title + '. The score of ' + score + ' is less than file: ' + bestFileForTitle[title].file + ' ' + bestFileForTitle[title].score));
                                }
                            }

                            nextcontent();

                        }, function(err, result) {
                            if (err) return callback(err);
                            
                            //loop over all best file matches
                            async.eachOfSeries(bestFileForTitle, function(value, key, nextTitle) {
                                
                                var sourceFile = path.join(workingFolder, value.file);
                                var destinationFile = path.join(destinationFolder, key, '0.jpg');

                                //MOVE files out of working folder, this leaves unknown files in the working folder
                                fs.move(sourceFile, destinationFile, err => {
                                    if (err) return callback(err)

                                    return nextTitle();
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


    var getScores = function(term, collection) {

        var scores = [];
        var i = 0; 
        var len = collection.length;

        //record scores for all in collection
        for (i; i < len; ++i) {
            scores.push({
                target: collection[i],
                score: stringScore(term, collection[i] + '(USA)', 0.5) //adding (USA) to better match emumovies
            });
        }

        scores.sort(function(a, b){
            return b.score - a.score;
        });

        return scores;
    };
});