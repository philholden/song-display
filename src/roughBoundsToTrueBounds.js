'use strict';

var canvasGetBounds = require('./canvasGetBounds');
var Transform = require('./Transform');

//Takes a song that has been meta info about verse metrics and renders
//each verse to a canvas. w and h is the desired width and height
//the function has two passes the first pass renders larger than
//desired size in order to get better metrics. The second pass is
//at the desired size.

function roughBoundsToTrueBounds(drawCallback, w, h, bounds1, bounds2) {
  var aspect = w / h;
  var songAspect = bounds1.w / bounds1.h;
  var canvas = document.createElement('canvas');
//  var mLineHeight = song.fontMetrics.h * song.lineHeight;
  var sf = aspect > songAspect ? h / bounds1.h : w / bounds1.w;
  var ctx;
  var padding = 4;
  var trans = new Transform();
  var transInv;
  var trueBounds;
  var overscan = 1.1;

  canvas.setAttribute('id', 'canvas-super');

  //bounds true on second pass
  if (bounds2) {
    sf = aspect > bounds2.w / bounds2.h ?
      h / (bounds2.h / (sf * overscan)) :
      w / (bounds2.w / (sf * overscan));
    canvas.width = Math.ceil(sf * bounds1.w) + padding * 2;
    canvas.height = Math.ceil(sf * bounds1.h) + padding * 2;
  } else {
    sf *= overscan;
    canvas.width = Math.ceil(sf * bounds1.w) + padding * 2;
    canvas.height = Math.ceil(sf * bounds1.h) + padding * 2;
  }

  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.save();
  trans.scale(sf, sf);
  trans.translate(padding / sf, padding / sf);
  transInv = trans.getInverseTransform();
  ctx.setTransform.apply(ctx, trans.m);

  //draw all verses on top of each other
  drawCallback(ctx);

  if (bounds2) {
    bounds2 = canvasGetBounds(canvas);
    trueBounds = transInv.transformPoint(bounds2.x, bounds2.y);
    trueBounds.w = bounds2.w / sf;
    trueBounds.h = bounds2.h / sf;
    trueBounds.sf = sf;
    return trueBounds;
  } else {
    bounds2 = canvasGetBounds(canvas);
    //document.body.appendChild(canvas);
    return roughBoundsToTrueBounds(drawCallback, w, h, bounds1, bounds2);
  }
}

module.exports = roughBoundsToTrueBounds;