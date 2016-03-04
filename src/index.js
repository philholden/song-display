
import SongContext from './song-context'
import Song from './song'
import drawSongToGetBounds from './draw-song-to-get-bounds'
import drawVersesToGetBounds from './draw-verses-to-get-bounds'
import drawVerse from './draw-verse'
import drawSong from './draw-song'
import renderAffineText from './render-affine-text'


if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    location.reload()
  })
}


const valiant = new Song(
`He who would valiant be ’gainst all disaster,
Let him in constancy follow the Master.
There’s no discouragement shall make him once relent
His first avowed intent to be a pilgrim.

Who so beset him round with dismal stories
Do but themselves confound—his strength the more is.
No foes shall stay his might; though he with giants fight,
He will make good his right to be a pilgrim.

Since, Lord, Thou dost defend us with Thy Spirit,
We know we at the end, shall life inherit.
Then fancies flee away! I’ll fear not what men say,
I’ll labor night and day to be a pilgrim.
`)

export default class SongDisplay {

  constructor() {
    this.render = this.render.bind(this)
    this.isBlank = true
    this.mode = 'SHOW_VERSE'
    this.verseId = 0
    this.song = valiant
    this.songCtx = new SongContext({
      lineHeight: 1.4,
      fontHeight: 20,
      fontName: 'sans-serif',
      verseGap: .75
    })
    this.verseLayouts = this.songCtx.getPlausibleVerseLayouts(this.song)
    this.songLayouts = this.songCtx.getPlausibleSongLayouts(this.song)
  }

  setState({
    song,
    isBlank,
    verseId,
    mode //'SHOW_VERSE' | 'SHOW_SONG'
  }) {
    if (song !== this.song) {
      this.verseLayouts = this.songCtx.getPlausibleVerseLayouts(song)
      this.songLayouts = this.songCtx.getPlausibleSongLayouts(song)
    }
    if (isBlank !== undefined) this.isBlank = isBlank
    if (verseId !== undefined) this.verseId = verseId
    if (mode !== undefined) this.mode = mode
  }

  render({ ctx, width, height }) {
    ctx.fillColor = '#000'
    ctx.fillRect(0, 0, width, height)

    if (this.isBlank) return

    const songRender = () => {
      const bestfit = this.songCtx.findBestFit(
        this.songLayouts,
        width,
        height
      )
      const metrics = drawSongToGetBounds({
        song: bestfit,
        canvasWidth: width,
        canvasHeight: height
      })

      return {
        metrics,
        renderCallback: (ctx, offx, offy) => {
          drawSong({
            song: bestfit,
            ctx,
            x: offx,
            y: offy
          })
        }
      }
    }

    const verseRender = () => {
      const bestfit = this.songCtx.findBestFit(
        this.verseLayouts,
        width,
        height
      )
      const metrics = drawVersesToGetBounds({
        song:bestfit,
        canvasWidth: width,
        canvasHeight: height
      })

      return {
        metrics,
        renderCallback: (ctx, offx, offy) => {
          drawVerse({
            song: bestfit,
            ctx,
            x: offx,
            y: offy,
            verse: this.verseId
          })
        }
      }
    }

    const renderer = this.mode === 'SHOW_VERSE' ?
      verseRender():
      songRender()

    renderAffineText(
      ctx,
      renderer.metrics,
      renderer.renderCallback,
      {
        fill: '#fff',
        posX: width / 2,
        posY: height / 2,
        scaleX: 1,
        scaleY: 1
      }
    )
  }
}

