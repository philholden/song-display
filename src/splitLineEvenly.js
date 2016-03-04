'use strict';

function distributeBreaks(length, numBreaks) {
  var allBreaks = [];
  function recurse(i, out) {
    var gaps = length - 1 - i;
    var breaksLeft;
    var copy = [];
    var j;
    for(j = 0; j < out.length; j++) {
      copy.push(out[j]);
    }
    breaksLeft = numBreaks - copy.length;
    if(breaksLeft === 0) {
      allBreaks.push(copy);
      return;
    }
    copy.push(i);
    recurse(i + 1, copy);
    if (gaps > breaksLeft) {
      copy.pop();
      recurse(i + 1, copy);
    }
  }
  recurse(0, []);
  return allBreaks;
}

//all ways of splitting a line n times
function linePermutations(line, breaks) {
  var words = line.split(/\s/g);
  var permutes = distributeBreaks(words.length, breaks);
  var perm;
  var i = 0;
  var j;
  var join;
  var out = [];
  var word;
  while (perm = permutes[i]) {
    i++;
    join = words[0];
    j = 0;
    while (word = words[j + 1]) {
      join += (~perm.indexOf(j) ? '\n' : ' ') + word;
      j++;
    }
    out.push(join);
  }
  return out;
}

//find most ballanced position of breaks
function minDifference(permutations, canvas) {
  var i = 0;
  var j;
  var perm;
  var lines;
  var minDiff;
  var outi;
  var outlen;
  var diff;
  var min;
  var max;
  var len;
  var line;
  var ctx = canvas.getContext('2d');
  if(!permutations.length) return;
  while(perm = permutations[i]) {
    lines = perm.split(/\n/g);
    j = 1;
    min = ctx.measureText(lines[0]).width;
    max = min;
    while(line = lines[j]) {
      len = ctx.measureText(line).width;
      if (len > max) max = len;
      if (len < min) min = len;
      j++;
    }
    diff = max - min;
    if (minDiff === undefined || diff < minDiff) {
      minDiff = diff;
      outlen = max;
      outi = i;
    }
    i++;
  }
  return {txt: permutations[outi], width: outlen, breaks: lines.length - 1};
}

function splitLineEvenly(line, breaks, canvas) {
  var permutations = linePermutations(line, breaks);
  return minDifference(permutations, canvas);
}

module.exports = splitLineEvenly;