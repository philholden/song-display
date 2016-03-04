import drawVerse from './draw-verse'

export default function drawSong({ song, ctx, x, y, isStroke }) {
  let mLineHeight = song.fontMetrics.h * song.lineHeight
  song.verses.forEach((verse, i) => {
    drawVerse({ song, verse:i, ctx, x, y, isStroke })
    y += song.verseGap * song.fontMetrics.h + mLineHeight * verse.height
  })
}
