

import roughBoundsToTrueBounds from './roughBoundsToTrueBounds'
import drawVerse from './drawVerse'

export default function drawVersesToGetBounds(song, canvasWidth, canvasHeight, isStroke) {
  let bounds1 = {
    x: 0,
    y: 0,
    h: song.pxHeight,
    w: song.maxWidth
  }

  function drawCallback(ctx) {
    song.verses.forEach((verse, i) => {
      drawVerse(song, i, ctx, 0, 0, isStroke)
    })
  }

  return roughBoundsToTrueBounds(drawCallback, canvasWidth, canvasHeight, bounds1)
}
