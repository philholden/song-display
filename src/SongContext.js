'use strict';

var measureString = require('./measureString');
var splitWidestLine = require('./splitWidestLine');
var augmentSong = require('./augmentSong');

function SongContext(lineHeight, fontHeight, fontName, verseGap) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var fontMetrics = measureString('Hygpqil', canvas, fontHeight);
  verseGap = verseGap || lineHeight;
  fontName = fontName || 'Courier, Serif, Helvetica, Arial, Sans-Serif';
  ctx.font = fontHeight + 'px ' + fontName;

  function clone(obj) {
   return JSON.parse(JSON.stringify(obj));
  }

  function setSong(song) {
    function measure(line){
      return {
        line: line,
        brokenLine: line,
        height: 1,
        width: ctx.measureText(line).width
      };
    }
    var metaSong = {
      verseGap: verseGap,
      fontMetrics: fontMetrics,
      fontHeight: fontHeight, //fontHeight specified
      fontName: fontName,
      lineHeight: lineHeight //multiplier e.g. 1.4
    };
    metaSong.verses = song.verses.map(function(verse){
      return {
        lines: verse.lines.map(measure)
      };
    });
    return metaSong;
  }

  function log(song) {
    var brokenSong = song.verses.map(function(verse){
      return verse.lines.map(function(line) {
        return line.brokenLine;
      }).join('\n');
    }).join('\n\n');
  }

  function findBestFit(plausibleLayouts, w, h) {
    var aspect = w / h;
    var out = plausibleLayouts[0];
    var margin = Math.abs(aspect - plausibleLayouts[0].aspect);
    var m;
    for(var i = 1; i < plausibleLayouts.length; i++) {
      m = Math.abs(aspect - plausibleLayouts[i].aspect);
      if (m < margin) {
        margin = m;
        out = plausibleLayouts[i];
      }
    }
    log(out);
    return out;
  }

  function getPlausibleSongLayouts(song) {
    var augmented = augmentSong(setSong(song), true);
    var plausible = [];
    function tick(augmented) {

      var maxHeight;

      //find max width of longest verse
      augmented = clone(augmented);
      maxHeight = augmented.maxHeight;

      //if all lines shorter than longest word return ie minwidth

      if(augmented.pnumLines === augmented.numLines || maxHeight === 1000) {
        return;
      }

      plausible.push(clone(augmented));
      splitWidestLine(augmented.verses, canvas);

      augmented = augmentSong(augmented, true);
      tick(augmented);
    }

    tick(augmented);

    return plausible;
  }

  function getPlausibleVerseLayouts(song) {
    var augmented = augmentSong(setSong(song), false);
    var plausible = [];
    function tick(augmented) {
      var shortVerses;
      var longVerses;
      var longerMaxWidth;
      var shorterMaxWidth;
      var maxHeight;

      function shorts(verse) {
        return !longs(verse);//verse.height < maxHeight;
      }

      function longs(verse) {
        return verse.height >= maxHeight || verse.width <= augmented.maxWidth;
      }

      function maxWidth(a, b){
        return Math.max(a.width, b.width);
      }

      //find max width of longest verse
      augmented = clone(augmented);
      maxHeight = augmented.maxHeight;
      shortVerses = augmented.verses.filter(shorts);
      longVerses = augmented.verses.filter(longs);
      longerMaxWidth = longVerses.reduce(maxWidth, longVerses[0].width);
      if (shortVerses.length) {
        shorterMaxWidth = shortVerses.reduce(maxWidth, longVerses[0].width);
      }

      //if all lines shorter than longest word return ie minwidth

      if(augmented.pnumLines === augmented.numLines) {
        return;
      }

      //if shorter narrower than longer or empty
      if (!shortVerses.length || longerMaxWidth >= shorterMaxWidth){
        //stop if 50 lines reached
        if (maxHeight === 50) {
          return;
        }
        plausible.push(clone(augmented));
        splitWidestLine(longVerses, canvas);
      } else {
        splitWidestLine(shortVerses, canvas);
      }

      augmented = augmentSong(augmented, false);
      tick(augmented);
    }

    tick(augmented);

    return plausible;
  }

  return {
    setSong: setSong,
    getPlausibleSongLayouts: getPlausibleSongLayouts,
    getPlausibleVerseLayouts: getPlausibleVerseLayouts,
    findBestFit: findBestFit,
    log: log
  };
}
module.exports = SongContext;