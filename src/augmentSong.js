export default function augmentSong(metaSong, isSong) {
  let h = 0
  let w = 0 //widest verse
  let vHeight
  let vWidth //widest line
  let numLines = 0
  let augmented = JSON.parse(JSON.stringify(metaSong))
  let mFontHeight = augmented.fontMetrics.h
  let lineHeight = augmented.lineHeight
  let mLineHeight = augmented.fontMetrics.h * augmented.lineHeight
  let fontGap = (lineHeight - 1) * mFontHeight

  function max(line) {
    if (line.width > w ) w = line.width
    if (line.width > vWidth ) vWidth = line.width
    vHeight += line.height
  }

  function songHeight() {
    let height = (augmented.verses.length - 1) * augmented.verseGap * mFontHeight
    augmented.verses.forEach(verse => {
      let vh = verse.height
      height += vh * mLineHeight
    })
    height -= fontGap
    return height
  }

  augmented.verses.forEach(verse => {
    vHeight = 0
    vWidth = 0
    verse.lines.forEach(max)
    if (vHeight > h) h = vHeight
    if (vWidth > w) w = vWidth
    verse.height = vHeight
    verse.width = vWidth
    numLines += vHeight
  })


  augmented.pxHeight = isSong ?
    songHeight() :
    (h - 1) * fontGap + h * mFontHeight
  augmented.maxWidth = w
  augmented.maxHeight = h
  augmented.pnumLines = augmented.numLines
  augmented.numLines = numLines
  augmented.aspect = w / augmented.pxHeight
  return augmented
}
