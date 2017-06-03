expressjs-romsort
=====

This project was designed to manage and sort large rom file sets. Specifically, GoodTools merged sets which usually begin as a group of 7z files. It can however, be used for general purpose cases. See below.

requirements
__________________
- brew install imagemagick --with-webp
- brew install graphicsmagick
- npm install gm


getting started
------------------

This project is designed to operate with specific tasks sourcing content from one folder and writing their results to a destination folder. As such, the files placed in the source folder are untouched by the task and the task can be run over and over again. ALso - this means that your hard drive should have sufficient space to accomidate large file sets as tasks will usually duplicate (or more) the initial workload.

- To start, find the directory called "starthere"
- Create or copy a directory into this folder and give it a generic name like "nes", "gba", or "gen".
- Inside this new folder should be a massive rom collection or set of files we want to operate against.

building roms specifically for crazyerics.com
------------------

1) Put GoodMerged sets into a folder in 00 - starthere (/00 - starthere/[folder]/)
2) /decompress/[folder] --> to decompress all titles into their own folders with rom files
3) Go to the directory and look for any files which are NOT in folders. If a "Public Domain" folder exists, this is not a game so take its file contents out as well. 
4) Put all these "loose" rom files into the directory 07 - romfiles. 
5) /romfolders --> This creates a title folder for all the rom files. The result is in 08 - romfolders.
6) Take all the directories produced in 08 - rom folders and copy them to the folder in 01 - decompressed/[folder]. All games are now sorted into their own folder with the folders containing all rom files
7) /datafile/[folder] --> The resulting json file will be in 06 - datafile. It contains data for crazyerics.com about which romfile is most suitable to play and how search should return results, it is not complete yet however without box art information.
8) You have a choice to make! To offer all roms for a given title or only the top choice (based on playable rating). Since these compressed game files will exist on a CDN, perhaps let the systems game size dictate. N64 and GBA games for existance, you might want to use topchoice. For top choice, head to step 9A, for all game files, 10B
9) /topchoice/[folder]/false --> This selects the best game in each title folder. The resulting folder structure is in 05 - topchoice/[folder]. Notes: for the time being, we're only selecting the "best" rom to play on crazyerics.com for any given title. False says we don't want to flatten the resulting file struture (keep folders)
10A) /cdnreadysc --> prepare files for CDN. This compresses all files and jsonp wraps them for use on crazyerics.com
10B) /cdnready/[folder]/decompressed --> prepare all game files for CDN. This compresses all files and jsonp wraps when for use on crazyerics.com

quick instructions:
- /decompress?system=[folder]
- /romfolders
- /datafile?system=[folder]
- /cdnready?system=[folder]&source=["topchoice"|"decompressed"]

getting box art
------------------

How about some artwork for all those games? 

1) Open the /config/default.json file and add a new entry for the getboxart object. The key is the name of the datafile we generated at step 8. "shortname" is the resulting folder name in /workspace/09 - boxart and "searchterm" is the term we'll use when scapeing google image search.
2) /getboxart --> This looks over all the datafiles, checks for a config definition and then begins the process of downloading google image search results and resizes the result. It's very slick. Keep in mind that google can change their dom at any point. (I've had to chance the script because of this!) 
3) The resulting folder can be found in "09 - boxart". The images need to be manually verified in the browser next. Copy and paste the folder and put it in: /public/boxart/[folder]
3) Let's verify all the box art we downloaded. A lot of the time the art isn't always the first search result. In a browser, view /boxart/[folder]/all. Click a title to open a google image search for finding a better result, drag new images ontop of old ones (this uploads the new art and resizes it), delete art for games which have none. etc. Alternatively, you can browser to /boxart/[folder]/[alpha] to see only titles which begin with the letter [alpha], this might help for larger games :)
5) /datafile/boxart/[folder] --> This generates the final datafile which you'll use at crazyerics.com. This step looks through all the box art you verified and created a new json file which says art is included with a game. The result can be found in /workspace/datafile/[folder]_boxart.json.
6) Place this file in the /data directory in the expressjs-crazyerics project. Its contents are used at application start
7) Prepare folder structure for CDN. Run /cdnboxready/[folder]. This still will rename the title folders respective to how they are keyed and removes the "original.jpg" file used to create the resized images (to reduce the CDN footprint). The resulting folder can be found in /workspace/cdnboxready/[folder].

endpoints
------------------

These endpoints consist of operations you can perform on large file sets.

/decompress/
------------------
have: brew install p7zip
required query param: system : The folder name within /workspace/00 - starthere/ (snes, gen, gb, gba...)


source folder: /workspace/00 - starthere/[folder]
destination folder: /workspace/01 - decompressed/[folder]

Given a folder name to look for in the "starthere" folder, unzips all files from 7z, zip or rar into destination folder. The resulting decompressed files will be placed into a folder of the same name as the original file.


/compressfiles
------------------
required query param: system : The folder name within /workspace/01 - decompressed/ (snes, gen, gb, gba...)
required query param: compression (zip|7z)
optional query param: filter (verified|none)

source folder: /workspace/01 - decompressed/[folder]
destination folder: /workspace/02 - compressedfiles/[folder]

Desgined to be run after decompress. Requires compression type to be passed. If compression type is not known, then task completes by copying file without compression. With rom files now in their own folders from the previous step. This task is designed to compress each of those rom files. The resulting set will be the destination folder, folders titled by their original 7z name (usually the game name), and then the compressed rom files.

filter parameter: (verified|none). Use verified to include only [!] games in the resulting folder. I did this for powerpack titles because it returns more choices than the "topchoice" task


/alphasort
------------------
required query param: system : The folder name within /workspace/02 - compressedfiles/ (snes, gen, gb, gba...)

source folder: /workspace/02 - compressedfiles/[folder]
destination folder: /workspace/04 - alphasorted/[folder]

Designed to be run after compressfiles. This task sorts the resulting game folders into folders which represnt the letter they begin with. The idea to make browsing a file system easier to find a game to play. At the time of this documentation, folders are grouped with two letters to make initial browsing easiest:

A-B
C-D
E-F

This arrangement can be changed in source code however should it make more sense to use single letter folder (A, B, C) or larger groups (A-C, D-F). 

An additional sub-task called "sorthacks" is also included in this step. For each game folder with zipped roms, there could be a large number of files which represent "hacked" versions of the original game since GoodTools places them in merged sets. This subtask attempts to idenify those files and moves them into a further directory called "Hacks". This result is that the game directory is easier to browse. (Note: games like Super Mario World had so many hacked versions I had trouble finding the original game)

/datafile
------------------
required query param: system : The folder name within /workspace/01 - decompressed/ (snes, gen, gb, gba...)

source folder: /workspace/01 - decompressed/[folder]
destination folder: /workspace/06 - datafile/[folder].json

This produces a json file with all titles found in decompressed. It looks at each rom file and determines a "rank" for playability of crazyerics.com (you know the drill, the more suited for US players the higher).

/datafile/addboxart/[folder]

source folder: /workspace/06 - datafile/[folder]
source folder: /public/boxart/[folder]
destination folder: /datafileready/[folder].json

This step looks through all the boxart you verified or uploaded to /public/boxart/[folder] and appends the datafile with a flag that says art is included with a title. The resulting data file is ready for crazyerics.com


/topchoice/[folder]/[flatten]
------------------

source folder: /workspace/01 - decompressed/[folder]
destination folder: /workspace/05 - topchoice/[folder]

Designed to be run after datafile is produces. Look through the datafile produced, take the top ranking game file for each title, then create a folder and place that rom file into it in the destination folder. This routine can be used to reduce a set of roms to the ones you find playable in general, or for crazyerics.com when the entire rom set (like gba, n64) is just too large

The flatten (true|false) parameter: The resulting folder will have true) all rom files false) title folders with top choice inside (best for crazyerics)

/cdnready/[folder]/[source]
------------------

source folder: /workspace/05 - topchoice/[folder]
destination folder: /workspace/cdnready/[folder]

source param specifies where which titles to compress: 
"topchoice": source the results in the 05 - topchoice/[folders]
"decompressed": source the results in the 01 - decompressed/[folders]
essentially we are decided between compressing an entire rom set for the CDN or just the "best playable" rom for each title.

This task is specifically designed for compressing and jsonp wrapping rom file contents for use on crazyerics.com. The task looks through all folders and files in the source directory and compresses them, using pako, and then encodes the result as a string inside a jsonp wrapper. The resulting file is saved in a flat file system where the file name is encoded to match the title and rom file (Donkey Kong + Donkey Kong (U)[!]) making a unique file name for the CDN.

/romfolders
------------------

source folder: /workspace/07 - romfiles
destination folder: /workspace/08 - romfolders

This task takes a folder (source) full of roms files, then examines the file names, create a directory for that game in destination then moves the original file into it. The point of this task is to take a set of roms and make them games that can be parsed by the rest of the system. This is especially true for all games usually grouped together in a "Public Domain" folder. Since the game is not "Public Domain", we want to break out those games into their own folders.

/getboxart
------------------

source folder: /workspace/06 - datafile
destination folder: /workspace/09 - boxart

Seriously: scrape google's image search dom, extract the url for the first image result, download it and then resize it as necessary. This task never overwrites anything allowing you to continue if it stops (and it does for some reason sometimes). Google MAY change their dom at any point obivously, so this task might be tinkering in the future.

/makeshader/[name]
------------------ 

source folder: /workspace/10 - shaderfiles
destination folder: /workspace/cdnshaderready

Like roms, we want to load shader data from a CDN instead of the crazyerics server. To do this, we also need to compress all the shader files and wrap them in a jsonp function. Put the glslp file in the source folder. Open it and flatten the path's for all the glsl files. Then go and put the glsl files in the source folder as well. Be sure that the "FrameDirection" and "FrameCount" variables (4 per file?) is a float instead of an int (only works this way). Supply a name for the resulting file. Put the file on the cdn. yay!

/makeallshaders
------------------

source folders: /workspace/11 - glslshaders, /workspace/12 - cgshaders
destination folders: /workspace/10 - shaderfiles, /workspace/cdnshaderready

Ok, this is a big important one. The idea here is to programmtically build all the shaders for crazyerics using the folder structure from retroarch. Retroarch should provide both cg shaders and opengl, webgl compatible glsl shaders. The directory structure will look identical for both. Glsl shaders seem to be become a more standardized approach since mobile platforms seem to use them (at least Android does) so check for updates in the future. The project is always getting updated of course. I need the cg shaders as well for this process because strangely none of the texture assets are included in the glsl dir tree for some reason. I simply take those needed from the cg dir tree during the process. Of important note I guess - all the glsl shaders are build using a conversion from the cg shaders, so I treat the cg directory tree as a source for all shader content.

1) Put the glsl and cg shader directories into each source folder
2) Open the glsl dir and hunt for and replace the existance of "int FrameDirection" and "int FrameCount" - they need to all be changed to "float". They don't work in a WebGL context otherwise.
3) At the time of this writing, the multiple texture definitions also do not seem to be working in WebGL. The gb-shaders are a typical example of both a background and pixel texture. I eliminate the background texture to get them to work, but there might be others. The shaders will crash javascript otherwise.
4) Run!
5) Sit back and cross fingers

The resulting files are jsonp wrapped and ready for the cdn. They are essentially json with files and file conents for each shader. They are extracted at runtime.

/glsl
------------------

source folder: /workspace/11 - glslshaders
destination folder: /workspace/13 - glsl

This endpoint hunts through all the glsl shaders, finds the .glsl files, and then dumps them into the destination folder. My idea here was to have a flat directory of glsl files. When building the shaders, several glslp files refereced glsl files which did not exist (probably because whomever built the glsl shaders from cg shaders did not ensure they all corectly converted). My idea was if they did not exist, to simply look for a glsl shader in this director as a last resort. I abandoned this idea altogether though because too many glsl files shared the same name. I'll leave it here for any future needs.