var splitLineEvenly = require('./splitLineEvenly');

function splitWidestLine(verses, canvas) {
  function widest(widest, item) {
    return item.width > widest.width ? item : widest;
  }
  var widestVerse = verses.reduce(widest);
  var widestLine = widestVerse.lines.reduce(widest);
  var brokenLine = splitLineEvenly(widestLine.line, widestLine.height, canvas);
  widestLine.width = brokenLine.width;
  widestLine.height = brokenLine.breaks + 1;
  widestLine.brokenLine = brokenLine.txt;
}

module.exports = splitWidestLine;