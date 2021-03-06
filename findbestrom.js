var Main = require('./main.js');

FindBestRom = function() {
};

/**
 * Given an array of roms files, matches Good Roms data to find the most likely playable game
 * @param  {Array} files
 * @param {number} officialscore the score at which the game is considered an official release
 * @return {string}
 */
FindBestRom.exec = function(files, officialscore) {

    //regular exp for region. order of importance. we're seeking a game which is probably in english
    var reRegion = {
        w:      new RegExp('\\([A-Z]*W[A-Z]*\\)', 'g'),        //World release
        u:    new RegExp('\\([A-Z]*U[A-Z]*\\)', 'g'),    //US region but not Unl
        uk:     new RegExp('\\(UK\\)', 'g'),       //UK release
        a:      new RegExp('\\(A\\)', 'g'),        //Ausrilia release
        four:      new RegExp('\\(4\\)', 'ig'),        //According to GoodTools this is used for (UB)
        e:      new RegExp('\\([A-Z]*E[A-Z]*\\)', 'g')    //Europe somewhere inside (last ditch check as can be english sometimes),
    };

    var reTrans = {
        engn:    new RegExp('t\\+eng(\\d+\\.\\d+)', 'ig'),   //t+eng + means newer translation (with version number)
        engo:    new RegExp('t\\-eng(\\d+\\.\\d+)', 'ig'),   //t-eng - means older translation (with version number)
        eng:    new RegExp('t[\\+\\-]eng', 'ig')             //t+\-eng no version number
    }

    //regions not in english are still important so that they arent ranked low
    var reRegion2 = {
        g:     new RegExp('\\(g\\)', 'ig'),        //germany
        f:     new RegExp('\\(f\\)', 'ig'),        //france
        i:     new RegExp('\\(i\\)', 'ig'),        //italy
        d:     new RegExp('\\(d\\)', 'ig'),        //dutch
        b:     new RegExp('\\(b\\)', 'ig'),        //brazil
        ni:     new RegExp('\\(ni\\)', 'ig'),        //netherlands
        no:     new RegExp('\\(no\\)', 'ig'),        //norway
        gr:     new RegExp('\\(gr\\)', 'ig'),        //greece
        r:     new RegExp('\\(r\\)', 'ig'),        //russia
        s:     new RegExp('\\(s\\)', 'ig'),        //spain
        sw:     new RegExp('\\(s\\)', 'ig'),        //sweden
        j:      new RegExp('\\(j\\)', 'ig'),        //japanese
        jp:     new RegExp('\\(jp\\)', 'ig'),        //japanese
        as:     new RegExp('\\(as\\)', 'ig'),        //asia
        k:     new RegExp('\\(k\\)', 'ig'),        //asia
        hk:     new RegExp('\\(hk\\)', 'ig'),        //hong kong
        ch:     new RegExp('\\(ch\\)', 'ig'),        //china
    };


    var reOption = {
        v3:     new RegExp('\\(V1\\.3\\)', 'ig'),   //when a game has a version greater than (V1.0), we want to give it a higher ranking
        v2:     new RegExp('\\(V1\\.2\\)', 'ig'),
        v1:     new RegExp('\\(V1\\.1\\)', 'ig'),
        v0:     new RegExp('\\(V1\\.0\\)', 'ig'),
        c:      new RegExp('\\[C\\]', 'ig'),        //color!
        p:      new RegExp('\\[!\\]', 'ig'),        //The ROM is an exact copy of the original game; it has not had any hacks or modifications.
        f:      new RegExp('\\[f\d?\\]', 'ig'),        //A fixed dump is a ROM that has been altered to run better on a flashcart or an emulator.
        b:      new RegExp('\\[', 'ig'),
        unl:    new RegExp('\\(unl','gi')           //unlisenced
    };
    var i;
    var j;
    var re;

    //must additionally pass these incoming regex's as further arguments
    // var reExtra = [];
    // for (i = 0; i < exts.length; ++i) {
    //     reExtra.push(new RegExp('\.' + exts[i] + '$', 'gi'));
    // }

    var result = null;      //the resulting file by name
    var resultindex = 0;    //the index of the resulting game in the "files" array
    var resultScore = 0;

    //pass over all files. as soon as we find a successful match, break out and try the next file
    for (i = 0; i < files.length; ++i) {

        var item = files[i];
        var fallingScore = 500;  //starts high, decrements on each pass
        var itemScore = 0;

        if (item === '.DS_Store') {
            continue;
        }

        //first must pass only one of the extra regex's coming in (usually file ext)
        // var pass = false;
        // for (j = 0; j < reExtra.length; ++j) {
        //     if (item.match(reExtra[j])) {
        //         pass = true;
        //     }
        // }
        // if (!pass) {
        //     continue;
        // }

        //let's give bonus points (less than 1) at the start of each file before current begins to decrement
        if (item.match(reOption.c)) {
            fallingScore += 0.1;
        }
        
        if (item.match(reOption.v3)) {
            fallingScore += 0.1;
        }

        if (item.match(reOption.v2)) {
            fallingScore += 0.2
        }

        if (item.match(reOption.v1)) {
            fallingScore += 0.3
        }

        if (item.match(reOption.v0)) {
            fallingScore += 0.4;
        }
        //end bonuses


        //pass over all english regions with playable, no unlisenced [!] //450 to 500
        for (re in reRegion) {
            if (item.match(reRegion[re]) && item.match(reOption.p) && !item.match(reOption.unl) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        fallingScore = 450;

        //pass over all english regions, no brackets, no unlisenced 400 - 450
        for (re in reRegion) {
            if (item.match(reRegion[re]) && !item.match(reOption.b) && !item.match(reOption.unl) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        //consider english translations, cant have more than the brackets surrounding the [t+eng] statement
        for (re in reTrans) {
            var brackets = item.match(reOption.b);
            if (item.match(reTrans[re]) && (brackets.length == 1) && itemScore < fallingScore) {
                itemScore = fallingScore;

                //parse out the version number of the translation and add it to the score (higher vesions will edge out)
                var groups = reTrans[re].exec(item);
                if (groups[1]) {
                    itemScore += parseFloat(groups[1]);
                }
            }
            --fallingScore;
        }

        //pass over all english regions, no brackets, unlisenced ok 400 - 450
        for (re in reRegion) {
            if (item.match(reRegion[re]) && !item.match(reOption.b) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        fallingScore = 400; //line between domestic and foreign!! (> 400)

        //all non-english regions with playable [!] above 350
        for (re in reRegion2) {
            if (item.match(reRegion2[re]) && item.match(reOption.p) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        fallingScore = 350;

        //pass over all non-english regions, no brackets above 300
        for (re in reRegion2) {
            if (item.match(reRegion2[re]) && !item.match(reOption.b) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        fallingScore = 300;

        //has playable [!] with no matching region data above 250
        if (item.match(reOption.p) && itemScore < fallingScore) {
            itemScore = fallingScore;
        }
        --fallingScore;

        fallingScore = 250; //cut off box front art here, chances that anything lower won't have art is high

        //all english regions with fixed dump [f]
        for (re in reRegion) {
            if (item.match(reRegion[re]) && item.match(reOption.f) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        //all non-english regions with fixed dump [f]
        for (re in reRegion2) {
            if (item.match(reRegion[re]) && item.match(reOption.f) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        //all english regions
        for (re in reRegion) {
            if (item.match(reRegion[re]) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        //all non-english regions
        for (re in reRegion2) {
            if (item.match(reRegion2[re]) && itemScore < fallingScore) {
                itemScore = fallingScore;
            }
            --fallingScore;
        }

        //no brackets
        if (!item.match(reOption.b) && itemScore < fallingScore) {
            itemScore = fallingScore;
        }

        //compute! This the file's score better than the previous files?
        if (itemScore > resultScore)
        {
            result = item;
            resultindex = i;
            resultScore = itemScore;
        }
    }

    //if no matches, just take first item
    if (!result && files.length > 0) {
        result = files[0];
        resultindex = 0;
    }

    return {
        game: result,
        index: resultindex,
        rank: resultScore.toFixed(2)
    };
};

module.exports = FindBestRom;