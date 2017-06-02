var fs = require('fs-extra');
var async = require('async');
var config = require('config');
var request = require('request');
var Main = require('./main.js');
var parseString = require('xml2js').parseString;
var score = require('string_score');

TheGamesDB = function() {
};

TheGamesDB.exec = function(system, wordmatchscore, updateOption, masterFilePath, destinationFile, reportFile, callback) {

    var self = this;
	var compress = true;
    var details = config.get('thegamesdb')[system];
    var fuzzyScore = 0.5
	var thegamesdbdata = {};
    var reportdata = {
    	header: {
    		config: details,
    		ran: Date.now(),
    		system: system,
    		wordmatchscore: wordmatchscore,
    		updateOption: updateOption,
    		masterFilePath: masterFilePath,
    		destinationFile: destinationFile,
    		reportFile: reportFile,
    		fuzziness: fuzzyScore
    	}
    };


    self.getExistingData(destinationFile, function (err, thegamesdbFileData) {
    	if (err) {
    		return callback(err);
    	}

    	//read master file
		fs.readJson(masterFilePath, function (err, masterFile) {
			if (err) {
	            return callback(err);            
	        }

	        //async does not provide a good object iterator (they state their reasons well)
	        var titles = [];
	        for (title in masterFile) {

	        	//if update is all, take all
	        	if (updateOption === 'all') {
	            	titles.push(title);
	            
	            } else if (updateOption === 'missing') {

	            	//only add games which are not in the thegamesdb already
	            	if (thegamesdbFileData[title] === undefined) {
	            		titles.push(title);
	            	}
	            } else if (updateOption === 'empty') {

	            	//those that are in the gamesdb datafile but last time did not return any data
	            	if (thegamesdbFileData[title] && thegamesdbFileData[title].id === undefined) {
	            		titles.push(title);
	            	}

	            } else if (updateOption === title) {
	            	//if we have an exact match, use it only
	            	titles.push(updateOption);
	            }
	        }

	        //loop over titles
	        async.eachSeries(titles, function(title, nexttitle) {

	        	console.log('-----------------------\n' + title + '\n-----------------------');
	        	var report = reportdata[title] = {};

	        	self.getGameList(title, function(err, list) {
	        		if (err) {
	                	console.log(err);
	                	return nexttitle(err);
	            	}

	            	if (list && list.Data && list.Data.Game) {

	            		var gamesList = list.Data.Game;
	            		var highestScore = {};
	            		var allMatches = [];
	            		var platformMatches = [];
	            		var matchedOtherGamesBetter = [];

	            		report.correctedName = self.correctName(title);
	            		report.gamelistresults = gamesList.length;

	            		//loop over games result in list
	            		async.eachSeries(gamesList, function(listgame, nextlistgame) {

	            			//has title and id?
	            			if (listgame.GameTitle && listgame.id && listgame.Platform) {

	            				//handles.. update as necessary if API changes
	            				var listtitle = listgame.GameTitle;
	            				var listplatform = listgame.Platform;
	            				
	            				//must match platform first
	            				var platformmatch = false;
	            				for (var i = 0; i < details.platform.length; ++i) {
	            					if (listplatform.trim() === details.platform[i]) {
	            						platformmatch = true;
	            					}
	            				}
	            				
	            				

	            				var matchscore = self.correctName(title).score(listtitle, fuzzyScore); //0.5 is a fuzziness score. without it we're scoring exact

	            				//only care about games higher than the max score
	            				if (matchscore >= wordmatchscore) {


	            					//ok, we DONT want to use this result if another game in our list has a higher score for it
	            					//a good example of this is Back to the Future Part II. 
	            					//If an entry doesnt exist for it but one does for Back to the Future III, it'll score high on that one and use it :P

	            					var otherGameScoredHigher = false;

	            					//in order to be considered for a match, must match platform
	            					if (platformmatch) {

		            					for (otherTitle in masterFile) {
		            						var otherscore = self.correctName(otherTitle).score(listtitle, fuzzyScore);
		            						
		            						//if something else scored higher, our match is better suited for something else.
		            						//note that the same game will return the same match score and is not greater than.
		            						if (otherscore > matchscore && otherTitle !== title) {
		            							otherGameScoredHigher = true;
		            							console.log('list item "' + listtitle + '" scored high (' + matchscore + ') but is higher with: "' + otherTitle + '": ' + otherscore);
		            							matchedOtherGamesBetter.push({
					            					title: otherTitle,
					            					score: otherscore
					            				});
		            						}
		            					}

		            					//does this score rank higher than the others on the list?
		            					if (!otherGameScoredHigher) {
			            					if (highestScore.score) {
			            						if (matchscore > highestScore.score) {
				            						highestScore.score = matchscore;
				            						highestScore.item = listgame;
				            					}
			            					} else {
			            						highestScore.score = matchscore;
			            						highestScore.item = listgame;
			            					}
			            				}

			            				platformMatches.push({
			            					title: listtitle,
			            					score: matchscore,
			            					platform: listplatform
			            				});
		            				}
	            				}

	            				if (!platformmatch) {
		            				allMatches.push({
		            					title: listtitle,
		            					score: matchscore,
		            					platform: listplatform
		            				});
		            			}
	            				
	            			}
	            			nextlistgame();

	            		}, function(err) {
	            			if (err) {
					            return nexttitle(err);
					        }

					        report.platformMatches = {};
					        report.matchedOtherGamesBetter = {};
					        report.allMatches = {};
					        report.getgamesuccess = false;
					        

					        //organize platform matches
					        if (platformMatches.length > 0) {
					        	platformMatches.sort(function(a, b) {
					        		if (a.score > b.score) {
					        			return -1;
					        		}
					        		if (a.score < b.score) {
					        			return 1;
					        		}
					        		return 0;
					        	});
					        	for (var i = 0; i < (platformMatches.length < 10 ? platformMatches.length : 10); ++i) {
					        		report.platformMatches[platformMatches[i].title] = platformMatches[i].score;
					        	}
					        }

					        if (matchedOtherGamesBetter.length > 0) {
					        	for (var i = 0; i < matchedOtherGamesBetter.length; ++i) {
					        		report.matchedOtherGamesBetter[matchedOtherGamesBetter[i].title] = matchedOtherGamesBetter[i].score;
					        	}
					        }

					        //organize all non-platform  matches
					        if (allMatches.length > 0) {
					        	allMatches.sort(function(a, b) {
					        		if (a.score > b.score) {
					        			return -1;
					        		}
					        		if (a.score < b.score) {
					        			return 1;
					        		}
					        		return 0;
					        	});
					        	for (var i = 0; i < (allMatches.length < 10 ? allMatches.length : 10); ++i) {
					        		report.allMatches[allMatches[i].title + ', ' + allMatches[i].platform] = allMatches[i].score;
					        	}
					        }

							if (highestScore.item) {
								//best match for this game found on list!
								
								console.log('best match: "' + highestScore.item.GameTitle + '": ' + highestScore.score);

								TheGamesDB.getGame(highestScore.item.id, function(err, data) {
									if (err) {
										return nexttitle(err);
									}

									//game specific details stored here
									if (data.Data && data.Data.Game) {
										
										//compress it all
										thegamesdbdata[title] = JSON.stringify(data.Data.Game);

										self.writeResult(destinationFile, thegamesdbdata, function(err) {
											if (err) {
												return nexttitle(err); //fatal
											}

											console.log('success. data retrieved for ' + highestScore.item.GameTitle);
											report.getgamesuccess = true;
											self.writeReport(reportFile, reportdata);
											nexttitle();
										});


									} else {
										//no data on getGame result
										console.log('weird!? no data returned for ' + highestScore.item.GameTitle + ' with id ' + highestScore.item.id);
										self.writeReport(reportFile, reportdata);
										nexttitle();
									}
								});

							} else {
								//no highest scoring item made, write game to file with empty data so that we know it was searched against
								thegamesdbdata[title] = {};

								for (match in report.platformMatches) {
									console.log('top match: ' + match + ': ' + report.platformMatches[match]);
								}

								self.writeResult(destinationFile, thegamesdbdata, function(err) {
									if (err) {
										console.log('self.writeResult ERROR:', err);
										return callback(err); //fatal
									}

									console.log('no best match found from game list. moving on...');
									
									self.writeReport(reportFile, reportdata);

									nexttitle();
								});
							}
	            		});
	            	
	            	} else {
	            		//no list.Data or list.Data.Game
	            		thegamesdbdata[title] = {};

						self.writeResult(destinationFile, thegamesdbdata, function(err) {
							if (err) {
								console.log('self.writeResult ERROR:', err);
								return callback(err); //fatal
							}

							report.gamelistresults = 0;
							self.writeReport(reportFile, reportdata);
							
							console.log('no list returned from thegamesdb. moving on...');
							nexttitle();
						});
	            	}
	        	});

	        }, function(err) {
	            if (err) {
	                return callback(err);
	            }

	            console.log('thegamesdb task complete. result in ' + destinationFile);
	            console.log('report for this process should be reviewed in ' + reportFile);
	        });
		});
    });
};

TheGamesDB.correctName = function(name) {

	//returns the to the beginning
	var newname = name;
	var locate = name.toLowerCase().indexOf(', the');
	var locate2 = name.toLowerCase().indexOf(', a');

	if (locate > -1) {
		newname = name.slice(locate + 2, locate + 5) + ' ' + name.slice(0, locate) + ' ' + name.slice(locate + 6, name.length);
		newname = newname.trim();
		//console.log('name corrected from "' + name + '" to "' + newname + '"');
	}

	if (locate2 > -1) {
		newname = name.slice(locate + 2, locate + 3) + ' ' + name.slice(0, locate) + ' ' + name.slice(locate + 4, name.length);
		newname = newname.trim();
		//console.log('name corrected from "' + name + '" to "' + newname + '"');
	}
	return newname;
};

TheGamesDB.writeResult = function(destinationFile, datafile, callback) {

	//write to file on each update
	fs.writeFile(destinationFile, JSON.stringify(datafile), function(err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};

TheGamesDB.getGame = function(id, callback) {

	console.log('getting game data from thegamesdb...');

	var self = this;
	var url = 'http://thegamesdb.net/api/GetGame.php?id=' + id;

	//make request to thegamesdb to retrieve a game list
	request({
        method: 'get',
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36'
        },
        timeout: 20000
    }, function(err, response, body) {
        if (err) {
        	
        	//in an error, pretty much always try again
        	console.log('TheGamesDB.getGame ERROR:', err);
        	self.getGame(id, callback);
        	return;
        }

        parseString(body, {
        	
        	explicitArray: false,
        	trim: true

        }, function (err, result) {
		    if (err) {

		    	//in an error, always try again
		    	console.log('TheGamesDB.getGame parse xml ERROR:', err);
	        	self.getGame(id, callback);
	        	return;
		    }
			callback(null, result);    
		});
    });
};

TheGamesDB.getGameList = function(game, callback) {

	console.log('getting game list from thegamesdb...');

	var self = this;
	var url = 'http://thegamesdb.net/api/GetGamesList.php?name=' + game;

	//make request to thegamesdb to retrieve a game list
	request({
        method: 'get',
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36'
        },
        timeout: 20000
    }, function(err, response, body) {
        if (err) {
        	
        	//in an error, always try again
        	console.log('TheGamesDB.getGameList ERROR:', err);
        	self.getGameList(game, callback);
        	return;
        }

        parseString(body, {
        	
        	explicitArray: false,
        	trim: true

        }, function (err, result) {
		    if (err) {
		    	
		    	//in an error, always try again
	        	console.log('TheGamesDB.getGameList parsing xml ERROR:', err);
	        	self.getGameList(game, callback);
	        	return;
		    }
			callback(null, result);    
		});
    });
};

TheGamesDB.writeReport = function(path, data, callback) {

	fs.writeFile(path, JSON.stringify(data), function(err) {
        if (err && callback) {
			return callback(err); //fatal
		}
		if (callback) {
			callback();
		}
    });
};

TheGamesDB.getExistingData = function(path, callback) {

	fs.exists(path, function (exists) {

    	if (exists) {

    		fs.readJson(path, function(err, data) {
    			if (err) {
    				console.log('ERROR:', err);
    				return callback(err);
    			}
    			callback(null, data);
    		});

    	} else {
    		callback(null, {}); //will be create on update
    	}
    });
};

module.exports = TheGamesDB;