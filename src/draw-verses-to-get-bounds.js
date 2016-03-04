

import roughBoundsToTrueBounds from './rough-bounds-to-true-bounds'
import drawVerse from './draw-verse'

export default function drawVersesToGetBounds({
  song,
  canvasWidth,
  canvasHeight,
  isStroke=false
}) {
  let bounds1 = {
    x: 0,
    y: 0,
    h: song.pxHeight,
    w: song.maxWidth
  }

  function drawCallback(ctx) {
    song.verses.forEach((verse, i) => {
      drawVerse({ song, verse: i, ctx, x:0, y:0, isStroke })
    })
  }

  return roughBoundsToTrueBounds(drawCallback, canvasWidth, canvasHeight, bounds1)
}
