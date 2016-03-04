
import roughBoundsToTrueBounds from './rough-bounds-to-true-bounds'
import drawSong from './draw-song'

export default function drawSongToGetBounds({
  song,
  canvasWidth,
  canvasHeight,
  isStroke = false
}) {
  let bounds1 = {
    x: 0,
    y: 0,
    h: song.pxHeight,
    w: song.maxWidth
  }

  function drawCallback(ctx) {
    drawSong({ song, ctx, x:0, y:0, isStroke })
  }
  return roughBoundsToTrueBounds(drawCallback, canvasWidth, canvasHeight, bounds1)
}
