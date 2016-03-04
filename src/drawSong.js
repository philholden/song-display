var drawVerse = require('./drawVerse');

module.exports = function drawSong(song, ctx, x, y, isStroke) {
  var mLineHeight = song.fontMetrics.h * song.lineHeight;
  song.verses.forEach(function(verse, i) {
    drawVerse(song, i, ctx, x, y, isStroke);
    y += song.verseGap * song.fontMetrics.h + mLineHeight * verse.height;
  });
}