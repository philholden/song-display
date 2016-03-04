

let measureString = require('./measureString')
let splitWidestLine = require('./splitWidestLine')
let augmentSong = require('./augmentSong')

export default function SongContext(lineHeight, fontHeight, fontName, verseGap) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  let fontMetrics = measureString('Hygpqil', canvas, fontHeight)
  verseGap = verseGap || lineHeight
  fontName = fontName || 'Courier, Serif, Helvetica, Arial, Sans-Serif'
  ctx.font = fontHeight + 'px ' + fontName

  function clone(obj) {
   return JSON.parse(JSON.stringify(obj))
  }

  function setSong(song) {
    function measure(line) {
      return {
        line,
        brokenLine: line,
        height: 1,
        width: ctx.measureText(line).width
      }
    }
    let metaSong = {
      verseGap,
      fontMetrics,
      fontHeight, //fontHeight specified
      fontName,
      lineHeight //multiplier e.g. 1.4
    }
    metaSong.verses = song.verses.map(verse => {
      return {
        lines: verse.lines.map(measure)
      }
    })
    return metaSong
  }

  function log(song) {
    let brokenSong = song.verses.map(verse => {
      return verse.lines.map(line => {
        return line.brokenLine
      }).join('\n')
    }).join('\n\n')
  }

  function findBestFit(plausibleLayouts, w, h) {
    let aspect = w / h
    let out = plausibleLayouts[0]
    let margin = Math.abs(aspect - plausibleLayouts[0].aspect)
    let m
    for(let i = 1 ;i < plausibleLayouts.length; i++) {
      m = Math.abs(aspect - plausibleLayouts[i].aspect)
      if (m < margin) {
        margin = m
        out = plausibleLayouts[i]
      }
    }
    log(out)
    return out
  }

  function getPlausibleSongLayouts(song) {
    let augmented = augmentSong(setSong(song), true)
    let plausible = []
    function tick(augmented) {

      let maxHeight

      //find max width of longest verse
      augmented = clone(augmented)
      maxHeight = augmented.maxHeight

      //if all lines shorter than longest word return ie minwidth

      if(augmented.pnumLines === augmented.numLines || maxHeight === 1000) {
        return
      }

      plausible.push(clone(augmented))
      splitWidestLine(augmented.verses, canvas)

      augmented = augmentSong(augmented, true)
      tick(augmented)
    }

    tick(augmented)

    return plausible
  }

  function getPlausibleVerseLayouts(song) {
    let augmented = augmentSong(setSong(song), false)
    let plausible = []
    function tick(augmented) {
      let shortVerses
      let longVerses
      let longerMaxWidth
      let shorterMaxWidth
      let maxHeight

      function shorts(verse) {
        return !longs(verse)//verse.height < maxHeight
      }

      function longs(verse) {
        return verse.height >= maxHeight || verse.width <= augmented.maxWidth
      }

      function maxWidth(a, b) {
        return Math.max(a.width, b.width)
      }

      //find max width of longest verse
      augmented = clone(augmented)
      maxHeight = augmented.maxHeight
      shortVerses = augmented.verses.filter(shorts)
      longVerses = augmented.verses.filter(longs)
      longerMaxWidth = longVerses.reduce(maxWidth, longVerses[0].width)
      if (shortVerses.length) {
        shorterMaxWidth = shortVerses.reduce(maxWidth, longVerses[0].width)
      }

      //if all lines shorter than longest word return ie minwidth

      if(augmented.pnumLines === augmented.numLines) {
        return
      }

      //if shorter narrower than longer or empty
      if (!shortVerses.length || longerMaxWidth >= shorterMaxWidth){
        //stop if 50 lines reached
        if (maxHeight === 50) {
          return
        }
        plausible.push(clone(augmented))
        splitWidestLine(longVerses, canvas)
      } else {
        splitWidestLine(shortVerses, canvas)
      }

      augmented = augmentSong(augmented, false)
      tick(augmented)
    }

    tick(augmented)

    return plausible
  }

  return {
    setSong,
    getPlausibleSongLayouts,
    getPlausibleVerseLayouts,
    findBestFit,
    log
  }
}
