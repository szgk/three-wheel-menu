export const getAngle = (x, y) => {
  if(y === 0) {
    return x >= 0 ? 0 : Math.PI
  }
  const a2 = Math.atan2(y, x)
  if(a2 > 0 ) {
    return a2
  } else {
    return Math.PI*2 + a2
  }
}

export const rotToRad = (rot) => rot * (Math.PI/180)

export const radToRot = (rad) => rad * (180/Math.PI)

export const getFormedAngle = (v1, v2) => Math.acos(v1.dot(v2) / (v1.length() * v2.length())) || 0
