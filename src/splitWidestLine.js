import splitLineEvenly from './splitLineEvenly'

export default function splitWidestLine(verses, canvas) {
  function widest(widest, item) {
    return item.width > widest.width ? item : widest
  }
  let widestVerse = verses.reduce(widest)
  let widestLine = widestVerse.lines.reduce(widest)
  let brokenLine = splitLineEvenly(widestLine.line, widestLine.height, canvas)
  widestLine.width = brokenLine.width
  widestLine.height = brokenLine.breaks + 1
  widestLine.brokenLine = brokenLine.txt
}
