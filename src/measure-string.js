

import canvasGetBounds from './canvas-get-bounds'

export default function measureString(text, canvas, fontSize, font) {
  let ctx = canvas.getContext('2d')
  let b
  fontSize = fontSize || 15
  font = font || 'Helvetica, Arial, Sans-Serif'
  ctx.font = fontSize + 'px ' + font
  canvas.width = ctx.measureText(text).width
  canvas.height = fontSize * 1.4
  ctx.font = fontSize + 'px ' + font
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 0,fontSize)
  b = canvasGetBounds(canvas)
  b.descent = b.y + b.h - fontSize
  b.ascent = b.h - b.descent
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(b.x, b.y, b.w, b.h)

  canvas.style.position = 'absolute'
  canvas.style.top = 0
  canvas.style.background = '#ff0'
  return b
}

