module.exports = function drawVerse(song, verse, ctx, x, y, isStroke) {
  var lineNum = 0;
  var mLineHeight = song.fontMetrics.h * song.lineHeight;
  ctx.font = song.fontHeight + 'px ' + song.fontName;
  song.verses[verse].lines.forEach(function(line) {
    line.brokenLine.split('\n').forEach(function(fragment) {
      if (isStroke) {
        ctx.strokeText(fragment, x, y + song.fontMetrics.ascent + lineNum * mLineHeight);
      } else {
        ctx.fillText(fragment, x, y + song.fontMetrics.ascent + lineNum * mLineHeight);
      }
      lineNum++;
    });
  });
}