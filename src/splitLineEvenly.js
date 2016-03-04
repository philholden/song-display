function distributeBreaks(length, numBreaks) {
  let allBreaks = []
  function recurse(i, out) {
    let gaps = length - 1 - i
    let breaksLeft
    let copy = []
    let j
    for(j = 0; j < out.length; j++) {
      copy.push(out[j])
    }
    breaksLeft = numBreaks - copy.length
    if(breaksLeft === 0) {
      allBreaks.push(copy)
      return
    }
    copy.push(i)
    recurse(i + 1, copy)
    if (gaps > breaksLeft) {
      copy.pop()
      recurse(i + 1, copy)
    }
  }
  recurse(0, [])
  return allBreaks
}

//all ways of splitting a line n times
function linePermutations(line, breaks) {
  let words = line.split(/\s/g)
  let permutes = distributeBreaks(words.length, breaks)
  let perm
  let i = 0
  let j
  let join
  let out = []
  let word
  while (perm = permutes[i]) {
    i++
    join = words[0]
    j = 0
    while (word = words[j + 1]) {
      join += (~perm.indexOf(j) ? '\n' : ' ') + word
      j++
    }
    out.push(join)
  }
  return out
}

//find most ballanced position of breaks
function minDifference(permutations, canvas) {
  let i = 0
  let j
  let perm
  let lines
  let minDiff
  let outi
  let outlen
  let diff
  let min
  let max
  let len
  let line
  let ctx = canvas.getContext('2d')
  if(!permutations.length) return
  while(perm = permutations[i]) {
    lines = perm.split(/\n/g)
    j = 1
    min = ctx.measureText(lines[0]).width
    max = min
    while(line = lines[j]) {
      len = ctx.measureText(line).width
      if (len > max) max = len
      if (len < min) min = len
      j++
    }
    diff = max - min
    if (minDiff === undefined || diff < minDiff) {
      minDiff = diff
      outlen = max
      outi = i
    }
    i++
  }
  return {
    txt: permutations[outi],
    width: outlen,
    breaks: lines.length - 1
  }
}

export default function splitLineEvenly(line, breaks, canvas) {
  let permutations = linePermutations(line, breaks)
  return minDifference(permutations, canvas)
}
