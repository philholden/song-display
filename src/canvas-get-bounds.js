export default function canvasGetBounds(canvas) {
  let w =  canvas.width
  let h = canvas.height
  let ctx = canvas.getContext('2d')
  let data = ctx.getImageData(0, 0, w, h).data
  let i = 0
  let out = {}
  let offset = 0

  //find top
  i = 0
  while(data[i<<2] === 0) {
    i++
  }

  if(data[i<<2] === undefined) {
    return null
  }
  out.y = Math.floor(i / w)

  //find bottom
  i = data.length>>2
  while(!data[i<<2]) {
    i--
  }
  out.h = Math.ceil(i / w) - out.y

  //find left
  i = 0
  do {
    i = offset
    while(data[i<<2] === 0) {
      i += w
    }
    offset++
  } while (data[i<<2] === undefined)
  out.x = offset - 1

  //find right
  offset = w -1
  i = 0
  do {
    i = offset
    while(data[i<<2] === 0) {
      i += w
    }
    offset--
  } while (data[i<<2] === undefined)

  out.w = offset + 2 - out.x
  return out
}
