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
        w:      new RegExp('\\(w\\)', 'ig'),        //World release
        u:      new RegExp('\\(u\\)', 'ig'),        //US region
        us:      new RegExp('\\(us\\)', 'ig'),      //US region
        ju:     new RegExp('\\(ju\\)', 'ig'),       //Japanese and US release
        uj:     new RegExp('\\(uj\\)', 'ig'),       //Japanese and US release (alt)
        ue:     new RegExp('\\(ue\\)', 'ig'),       //Europe and US release, or Europe only
        eu:     new RegExp('\\(eu\\)', 'ig'),       //Europe and US release (alt)
        ub:     new RegExp('\\(ub\\)', 'ig'),       //Brazil and US
        ueb:    new RegExp('\\(ueb\\)', 'ig'),      //Brazil, Europe and US
        jub:    new RegExp('\\(jub\\)', 'ig'),      //Japan, Brazil and US
        jue:    new RegExp('\\(jue\\)', 'ig'),      //Japan, Europe and US
        jeb:    new RegExp('\\(jeb\\)', 'ig'),      //Japan, Brazil and Europe
        uk:     new RegExp('\\(uk\\)', 'ig'),       //UK release
        c:      new RegExp('\\(c\\)', 'ig'),        //Canada release
        a:      new RegExp('\\(a\\)', 'ig'),        //Ausrilia release
        eb:     new RegExp('\\(eb\\)', 'ig'),        //Europe and Brazil
        e:      new RegExp('\\(e\\)', 'ig'),        //Europe release (last ditch check as can be english sometimes)
        eng:    new RegExp('Eng', 'ig')             //English translation of japanese game. I'm putting this up here so that it DOES appear in suggestions and searches
    };

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
        c:      new RegExp('\\[C\\]', 'ig'),        //color!
        p:      new RegExp('\\[!\\]', 'ig'),        //The ROM is an exact copy of the original game; it has not had any hacks or modifications.
        f:      new RegExp('\\[f\d?\\]', 'ig'),        //A fixed dump is a ROM that has been altered to run better on a flashcart or an emulator.
        b:      new RegExp('\\[', 'ig')
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
    var resultrank = 0;

    //pass over all files. as soon as we find a successful match, break out and try the next file
    for (i = 0; i < files.length; ++i) {

        var item = files[i];
        var currentrank = 500;  //starts high, decrements on each pass

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
            currentrank += 0.1;
        }

        if (item.match(reOption.v3)) {
            currentrank += 0.3;
        }

        if (item.match(reOption.v2)) {
            currentrank += 0.2
        }

        if (item.match(reOption.v1)) {
            currentrank += 0.1
        }
        //end bonuses


        //pass over all english regions with playable [!] //450 to 500
        for (re in reRegion) {
            if (item.match(reRegion[re]) && item.match(reOption.p) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        currentrank = 450;

        //pass over all english regions, no brackets 400 - 450
        for (re in reRegion) {
            if (item.match(reRegion[re]) && !item.match(reOption.b) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        currentrank = 400; //line between domestic and foreign!!

        //all non-english regions with playable [!] above 350
        for (re in reRegion2) {
            if (item.match(reRegion2[re]) && item.match(reOption.p) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        currentrank = 350;

        //pass over all non-english regions, no brackets above 300
        for (re in reRegion2) {
            if (item.match(reRegion2[re]) && !item.match(reOption.b) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        currentrank = 300;

        //has playable [!] with no matching region data above 250
        if (item.match(reOption.p) && resultrank < currentrank) {
            result = item;
            resultindex = i;
            resultrank = currentrank;
        }
        --currentrank;

        currentrank = 250; //cut off box front art here, chances that anything lower won't have art is high

        //all english regions with fixed dump [f]
        for (re in reRegion) {
            if (item.match(reRegion[re]) && item.match(reOption.f) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        //all non-english regions with fixed dump [f]
        for (re in reRegion2) {
            if (item.match(reRegion[re]) && item.match(reOption.f) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        //all english regions
        for (re in reRegion) {
            if (item.match(reRegion[re]) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        //all non-english regions
        for (re in reRegion2) {
            if (item.match(reRegion2[re]) && resultrank < currentrank) {
                result = item;
                resultindex = i;
                resultrank = currentrank;
            }
            --currentrank;
        }

        //no brackets
        if (!item.match(reOption.b) && resultrank < currentrank) {
            result = item;
            resultindex = i;
            resultrank = currentrank;
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
        rank: resultrank.toFixed(2)
    };
};

module.exports = FindBestRom;