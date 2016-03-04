function augmentSong(metaSong, isSong) {
  var h = 0;
  var w = 0; //widest verse
  var vHeight;
  var vWidth; //widest line
  var numLines = 0;
  var augmented = JSON.parse(JSON.stringify(metaSong));
  var mFontHeight = augmented.fontMetrics.h;
  var lineHeight = augmented.lineHeight;
  var mLineHeight = augmented.fontMetrics.h * augmented.lineHeight;
  var fontGap = (lineHeight - 1) * mFontHeight;

  function max(line) {
    if (line.width > w ){
      w = line.width;
    }
    if (line.width > vWidth ){
      vWidth = line.width;
    }
    vHeight += line.height;
  }

  function songHeight() {
    var height = (augmented.verses.length - 1) * augmented.verseGap * mFontHeight;
    augmented.verses.forEach(function(verse) {
      var vh = verse.height;
      height += vh * mLineHeight;
    });
    height -= fontGap;
    return height;
  }

  augmented.verses.forEach(function(verse){
    vHeight = 0;
    vWidth = 0;
    verse.lines.forEach(max);
    if (vHeight > h) h = vHeight;
    if (vWidth > w) w = vWidth;
    verse.height = vHeight;
    verse.width = vWidth;
    numLines += vHeight;
  });


  augmented.pxHeight = isSong ?
    songHeight() :
    (h - 1) * fontGap + h * mFontHeight;
  augmented.maxWidth = w;
  augmented.maxHeight = h;
  augmented.pnumLines = augmented.numLines;
  augmented.numLines = numLines;
  augmented.aspect = w / augmented.pxHeight;
  return augmented;
}

module.exports = augmentSong;