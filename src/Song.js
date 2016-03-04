export default class Song {
  constructor(text) {
    let tags = [ 'artist', 'title', 'id' ]
    let verses
    let self = this

    text = text.replace(/\r/g,'')

    function extractTag(tag) {
      let tagEx = new RegExp('^' + tag + ':\\s*(.*)$','m')
      let tagDel = new RegExp('^' + tag + ':\\s*(.*)[\n]?','m')
      let val = text.match(tagEx)
      val = val && val[1] && val[1].trim() || null
      if (val !== null) {
        self[tag] = val
      }
      text = text.replace(tagDel,'')
    }

    tags.forEach(extractTag)
    if (typeof(this.id) === 'string') {
      this.id = parseInt(this.id,10)
    }


    verses = text.trim().split('\n\n')
    verses = verses.map(verse => ({
      lines: verse.split('\n')
    }))

    verses = verses
      .filter(verse => !(
        verse.lines.length === 1 &&
        verse.lines[0] === '')
      )

    this.verses = verses
  }

  getTitle() {
    if (this.title !== undefined) {
      return this.title
    }
    return this.verses[0] &&
        this.verses[0].lines.length &&
        this.verses[0].lines[0] !== '' &&
        this.verses[0].lines[0] || undefined
  }

  toString() {
    return ([ 'title', 'artist', 'id ' ]
      .filter(tag => this[tag] !== undefined)
      .map(tag => tag + ': ' + this[tag])
      .join('\n') + '\n\n' +
      this.verses
        .map(verse => verse.lines.join('\n'))
        .join('\n\n'))
        .trim()
  }

  wholeSongText() {
    return this.verses
      .map(verse => verse.lines.join('\n'))
      .join('\n\n')
  }


  toLinesOnly() {
    let lines = []
    this.verses.forEach(verse => lines.concat(verse))
    return lines
  }

  maxLinesInVerse() {
    let max = 0
    this.verses
      .forEach(verse => max = Math.max(max, verse.length))
    return max
  }
}
