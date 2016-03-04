
import roughBoundsToTrueBounds from './roughBoundsToTrueBounds'
import drawSong from './drawSong'

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
