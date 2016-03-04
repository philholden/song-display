'use strict';

var roughBoundsToTrueBounds = require('./roughBoundsToTrueBounds');
var drawVerse = require('./drawVerse');

function drawVersesToGetBounds(song, canvasWidth, canvasHeight, isStroke) {
  var bounds1 = {
    x: 0,
    y: 0,
    h: song.pxHeight,
    w: song.maxWidth
  };

  function drawCallback(ctx) {
    song.verses.forEach(function(verse, i){
      drawVerse(song, i, ctx, 0, 0, isStroke);
    });
  }
  return roughBoundsToTrueBounds(drawCallback, canvasWidth, canvasHeight, bounds1);
}

module.exports = drawVersesToGetBounds;