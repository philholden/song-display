
import FullScreenCanvas from './FullScreenCanvas'
import SongContext from './SongContext'
import Song from './Song'
import drawSongToGetBounds from './drawSongToGetBounds'
import drawVersesToGetBounds from './drawVersesToGetBounds'
import drawVerse from './drawVerse'
import drawSong from './drawSong'
import renderAffineText from './renderAffineText'


if (module.hot) {
  console.log('hot')
  module.hot.accept()
  module.hot.dispose(() => {
    location.reload()
  })
}

function build(song) {
  let songCanvas = new FullScreenCanvas()
  let sc = SongContext({
    lineHeight: 1.4,
    fontHeight: 20,
    fontName: 'sans-serif',
    verseGap: .75
  })
  let songRenderer
  let verseRenderer
  let verseLayouts
  let songLayouts
  let mode = 'blank'
  let verseShown = 0
  let ctx
  let id = 0
  let renderVerseCallback

  setSong(song)
  showBlank()
  songCanvas.addEventListener('resize', recalc)

  function setSong(song) {
    mode = 'blank'
    song = song
    verseLayouts = sc.getPlausibleVerseLayouts(song)
    songLayouts = sc.getPlausibleSongLayouts(song)
    recalc()
    showSong()
  }

  function recalc() {
    ctx = songCanvas.canvas.getContext('2d')
    songRenderer = getSongRenderCallback(ctx, songLayouts)
    verseRenderer = getVerseRenderCallback(ctx, verseLayouts)
    render()
    //id++
    //animate(id)
  }

  function showSong() {
    mode = 'song'
    render()
  }

  function showBlank() {
    mode = 'blank'
    render()
  }

  function showVerse(n, song) {
    mode = 'verse'
    verseShown = n < 0 ?
      0 :
      n >= song.verses.length ?
        song.verses.length -1 :
        n
    render()
  }

  function clear() {
    //ctx.clearRect(0,0,songCanvas.w, songCanvas.h)
    ctx.fillColor = '#000'
    ctx.fillRect(0,0,songCanvas.w, songCanvas.h)
  }

  function getSongRenderCallback(ctx, layouts) {
    let bestfit = sc.findBestFit(layouts,songCanvas.w,songCanvas.h)
    let metrics = drawSongToGetBounds({
      song: bestfit,
      canvasWidth: songCanvas.w,
      canvasHeight: songCanvas.h,
      isStroke: false
    })
    return {
      metrics,
      renderCallback(ctx, offx, offy) {
        drawSong({
          song: bestfit,
          ctx,
          x: offx,
          y: offy
        })
      }
    }
  }

  function getVerseRenderCallback(ctx, layouts) {
    let bestfit = sc.findBestFit(layouts,songCanvas.w,songCanvas.h)
    let metrics = drawVersesToGetBounds({
      song:bestfit,
      canvasWidth: songCanvas.w,
      canvasHeight: songCanvas.h
    })
    return {
      metrics,
      renderCallback(ctx, offx, offy) {
        drawVerse({
          song: bestfit,
          ctx,
          x: offx,
          y: offy,
          verse: verseShown
        })
      }
    }
  }

  function render() {
    let renderer
    clear()
    console.log(mode)
    if (mode === 'blank') {
      return
    }
    if(mode === 'song') {
      renderer = songRenderer
    } else {
      renderer = verseRenderer
    }
    renderAffineText(ctx, renderer.metrics, renderer.renderCallback, {
      fill: '#fff',
      posX: songCanvas.w / 2,
      posY: songCanvas.h / 2,
      scaleX: 1,
      scaleY: 1
    })
  }

  document.body.addEventListener('keyup',(e) => {
    let n = e.keyCode - 48
    if (n === 0) {
      showSong()
    }
    if (n > 0 && n <= song.verses.length) {
      showVerse(n - 1, song)
    }
  })

  return {
    setSong,
    showVerse,
    showSong,
    showBlank,
    Song
  }
}

module.exports = build(new Song(
`Over the mountains and the sea,
Your river runs with love for me,
and I will open up my heart
and let the Healer set me free.
I'm happy to be in the truth,
and I will daily lift my hands:
for I will always sing of when
Your love came down. [Yeah!]

I could sing of Your love forever,
I could sing of Your love forever,
I could sing of Your love forever,
I could sing of Your love forever. [Repeat]

Oh, I feel like dancing -
it's foolishness I know;
but, when the world has seen the light,
they will dance with joy,
like we're dancing now.`))

let reqFullScreen = document.body.requestFullScreen ||
    document.body.webkitRequestFullScreen ||
    document.body.mozRequestFullScreen ||
    document.body.msRequestFullScreen || function() {}
