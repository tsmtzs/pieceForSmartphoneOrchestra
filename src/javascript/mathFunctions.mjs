/* eslint-env browser */
// //////////////////////////////////////////////////
//  This file collects mathematics functions.
// //////////////////////////////////////////////////

// Linear mapping [a, b] -> [c, d].
const map = (x, a = 0, b = 1, c = 0, d = 1) => {
  const diff = a - b

  if (diff === 0.0) throw Error('Argument a should be different than argument b.')

  return ((c - d) * x + a * d - b * c) / diff
}

// x => max(a, min(b, x))
const clip = (x, a, b) => {
  const min = Math.min(a, b)
  const max = Math.max(a, b)

  return Math.max(min, Math.min(max, x))
}

// Function 'rotateVector' is from the
// JavaScript library 'Quaternion.js'
// https://github.com/infusion/Quaternion.js
//
/**
 * Rotates a vector according to the current quaternion
 *
 * @param {Array} v The vector to be rotated
 * @returns {Array}
 */
const rotateVector = (quaternion, v) => {
  // [0, v'] = Q * [0, v] * Q'

  // Q
  const w1 = quaternion[3]
  const x1 = quaternion[0]
  const y1 = quaternion[1]
  const z1 = quaternion[2]

  // [0, v]
  const x2 = v[0]
  const y2 = v[1]
  const z2 = v[2]

  // Q * [0, v]
  const w3 = -x1 * x2 - y1 * y2 - z1 * z2
  const x3 = w1 * x2 + y1 * z2 - z1 * y2
  const y3 = w1 * y2 + z1 * x2 - x1 * z2
  const z3 = w1 * z2 + x1 * y2 - y1 * x2

  const x4 = x3 * w1 - w3 * x1 - y3 * z1 + z3 * y1
  const y4 = y3 * w1 - w3 * y1 - z3 * x1 + x3 * z1
  const z4 = z3 * w1 - w3 * z1 - x3 * y1 + y3 * x1

  return [x4, y4, z4]
}

// Vector related functions
// vector: is an Array
const vectorLength = (vector) => {
  return Math.hypot(...vector)
}

const vectorDotProduct = (vector1, vector2) => {
  return vector1
    .map((elem, i) => elem * vector2[i])
    .reduce((accumulator, currentVal) => accumulator + currentVal, 0)
}

const angleBetweenVectors = (vector1, vector2) => {
  if (isZeroVector(vector1) || isZeroVector(vector2)) throw Error('Angle is not defined when one of the vectors is zero.')

  return Math.acos(vectorDotProduct(vector1, vector2) / (vectorLength(vector1) * vectorLength(vector2)))
}

const isZeroVector = vector => vector.every(coord => coord === 0.0)

export {
  map,
  clip,
  rotateVector,
  vectorLength,
  vectorDotProduct,
  angleBetweenVectors
}
