

export default class Transform {

  constructor(matrix) {
    if(!matrix) {
      this.reset()
    } else {
      this.m = matrix
    }
  }

  reset() {
    this.m = [ 1,0,0,1,0,0 ]
  }

  multiply(matrix) {
    let m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1]
    let m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1]

    let m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3]
    let m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3]

    let dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4]
    let dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5]

    this.m[0] = m11
    this.m[1] = m12
    this.m[2] = m21
    this.m[3] = m22
    this.m[4] = dx
    this.m[5] = dy
  }

  getInverseTransform() {
    let d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2])
    let m0 = this.m[3] * d
    let m1 = -this.m[1] * d
    let m2 = -this.m[2] * d
    let m3 = this.m[0] * d
    let m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4])
    let m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5])
    return new Transform([ m0,m1,m2,m3,m4,m5 ])
  }

  rotate(rad) {
    let c = Math.cos(rad)
    let s = Math.sin(rad)
    let m11 = this.m[0] * c + this.m[2] * s
    let m12 = this.m[1] * c + this.m[3] * s
    let m21 = this.m[0] * -s + this.m[2] * c
    let m22 = this.m[1] * -s + this.m[3] * c
    this.m[0] = m11
    this.m[1] = m12
    this.m[2] = m21
    this.m[3] = m22
  }

  skewY(rad) {
    let r = Math.tan(rad)
    let m11 = this.m[0] + this.m[2] * r
    let m12 = this.m[1] + this.m[3] * r
    this.m[0] = m11
    this.m[1] = m12
  }

  skewX(rad) {
    let r = Math.tan(rad)
    let m21 = this.m[0] * r + this.m[2]
    let m22 = this.m[1] * r + this.m[3]
    this.m[2] = m21
    this.m[3] = m22
  }

  translate(x, y) {
    this.m[4] += this.m[0] * x + this.m[2] * y
    this.m[5] += this.m[1] * x + this.m[3] * y
  }

  scale(sx, sy) {
    this.m[0] *= sx
    this.m[1] *= sx
    this.m[2] *= sy
    this.m[3] *= sy
  }

  transformPoint(px, py) {
    let x = px
    let y = py
    px = x * this.m[0] + y * this.m[2] + this.m[4]
    py = x * this.m[1] + y * this.m[3] + this.m[5]
    return { x:px, y:py }
  }
}


// Transform.prototype.rotateAbout = function(rad, x, y) {
//   this.translate(x, y)
//   this.rotate(rad)
//   this.translate(-x, -y)
// }


// Transform.prototype.transformRect = function(rx, ry, rw, rh) {
//   let topLeft = this.transformPoint(rx, ry)
//   let bottomRight = this.transformPoint(rx + rw, ry + rh)
//   return {
//     x:topLeft[0],
//     y:topLeft[1],
//     w:bottomRight[0],
//     h:bottomRight[1]
//   }
// }
