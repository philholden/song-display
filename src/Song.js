function Song(text) {
  var tags = ['artist', 'title', 'id'];
  var verses;
  var self = this;

  text = text.replace(/\r/g,'');
  
  function extractTag(tag) {
    var tagEx = new RegExp('^' + tag + ':\\s*(.*)$','m');
    var tagDel = new RegExp('^' + tag + ':\\s*(.*)[\n]?','m');
    var val = text.match(tagEx);
    val = val && val[1] && val[1].trim() || null;
    if (val !== null) {
      self[tag] = val;
    }
    text = text.replace(tagDel,'');
  }
  
  tags.forEach(extractTag);
  if (typeof(this.id) === 'string') {
    this.id = parseInt(this.id,10);
  }

  
  verses = text.trim().split('\n\n');
  verses = verses.map(function(verse) {
    return {lines: verse.split('\n')};
  });
  
  verses = verses.filter(function(verse){
    return !(verse.lines.length === 1 && verse.lines[0] === '');
  });
  
  this.verses = verses;
}

Song.prototype.getTitle = function() {
  if (this.title !== undefined) {
    return this.title;
  }
  return this.verses[0] &&
      this.verses[0].lines.length &&
      this.verses[0].lines[0] !== '' &&
      this.verses[0].lines[0] || undefined;
};

Song.prototype.toString = function() {
  return (['title', 'artist', 'id'].filter(function(tag){
    return this[tag] !== undefined;
  }.bind(this)).map(function(tag){
    return tag + ': ' + this[tag];
  }.bind(this)).join('\n') +
  '\n\n' +
  this.verses.map(function(verse) {
    return verse.lines.join('\n');
  }).join('\n\n')).trim();
};

Song.prototype.wholeSongText = function() {
  return this.verses.map(function(verse) {
    return verse.lines.join('\n');
  }).join('\n\n');
}


Song.prototype.toLinesOnly = function() {
  var lines = [];
  this.verses.forEach(function(verse) {
    lines.concat(verse);
  })
  return lines;
};

Song.prototype.maxLinesInVerse = function() {
  var max = 0;
  this.verses.forEach(function(verse) {
    max = Math.max(max, verse.length);
  })
  return max;
};

module.exports = Song;