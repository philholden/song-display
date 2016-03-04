'use strict';

var roughBoundsToTrueBounds = require('./roughBoundsToTrueBounds');
var drawSong = require('./drawSong');

function drawSongToGetBounds(song, canvasWidth, canvasHeight, isStroke) {
  var bounds1 = {
    x: 0,
    y: 0,
    h: song.pxHeight,
    w: song.maxWidth
  };

  function drawCallback(ctx) {
    drawSong(song, ctx, 0, 0, isStroke);
  }
  return roughBoundsToTrueBounds(drawCallback, canvasWidth, canvasHeight, bounds1);
}

module.exports = drawSongToGetBounds;