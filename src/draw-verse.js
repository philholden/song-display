export default function drawVerse({
  song,
  verse,
  ctx,
  x,
  y,
  isStroke=false
}) {
  let lineNum = 0
  let mLineHeight = song.fontMetrics.h * song.lineHeight
  ctx.font = song.fontHeight + 'px ' + song.fontName
  song.verses[verse].lines.forEach(line => {
    line.brokenLine.split('\n').forEach(fragment => {
      if (isStroke) {
        ctx.strokeText(fragment, x, y + song.fontMetrics.ascent + lineNum * mLineHeight)
      } else {
        ctx.fillText(fragment, x, y + song.fontMetrics.ascent + lineNum * mLineHeight)
      }
      lineNum++
    })
  })
}
