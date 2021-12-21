/**
 * get angle formed by vector(x,y) & vector(1,0)
 * @param {number} x 
 * @param {number} y 
 * @returns {number} radian (0 ~ 2π)
 */
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

/**
 * change rotation to radius
 * @param {number} rot rotation
 * @returns {number} radian
 */
export const rotToRad = (rot) => rot * (Math.PI/180)
