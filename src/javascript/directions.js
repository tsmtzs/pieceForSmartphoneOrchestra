/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for smartphone orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/directions.html
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// Import statements.
// //////////////////////////////////////////////////
import { map } from './mathFunctions.mjs'

const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

// Coordinates
const innerPos = (a, b, x) => map(x, 0, 1, a, b)
const xA = 0.15
const yA = 0.5
const xB = 0.25
const yBDiv = 0.04
const yB = yA - yBDiv
const xC = 0.45
const yCDiv = 0.4
const yC = yA - yCDiv
const xD = 0.9
const yD = yA
const yB2 = yA + yBDiv
const yC2 = yA + yCDiv
const xControlAB = innerPos(xA, xB, 0.9)
const yControlABDiv = 0.005
const yControlAB = yA - yControlABDiv
const xControl1BC = innerPos(xB, xC, 0.4)
const yControl1BCDiv = 0.1
const yControl1BC = yA - yControl1BCDiv
const xControl2BC = innerPos(xB, xC, 0.65)
const yControl2BCDiv = 0.4
const yControl2BC = yA - yControl2BCDiv
const xControl1CD = innerPos(xC, xD, 0.3)
const yControl1CDDiv = 0.45
const yControl1CD = yA - yControl1CDDiv
const xControl2CD = innerPos(xC, xD, 0.45)
const yControl2CDDiv = 0.05
const yControl2CD = yA - yControl2CDDiv
const yControlAB2 = yA + yControlABDiv
const yControl1BC2 = yA + yControl1BCDiv
const yControl2BC2 = yA + yControl2BCDiv
const yControl1CD2 = yA + yControl1CDDiv
const yControl2CD2 = yA + yControl2CDDiv

// Gradient
const radialGrad = ctx.createRadialGradient(0.55 * width, 0.5 * height, 0.0 * width, 0.9 * height, 0.4 * height, 0.88 * width)
radialGrad.addColorStop(0, '#222831')
radialGrad.addColorStop(0.5, '#f2f2f2')

// Background
ctx.fillStyle = '#393e46'
ctx.fillRect(0, 0, width, height)
// Font
ctx.fillStyle = '#f2f2f2'
ctx.font = '0.9rem serif'
ctx.textBaseline = 'middle'
ctx.fillText('START', 0.01 * width, 0.5 * height)
ctx.fillText('END', 0.9 * width, 0.5 * height)
//
ctx.fillStyle = radialGrad
ctx.beginPath()
ctx.moveTo(xA * width, yA * height)
ctx.quadraticCurveTo(xControlAB * width, yControlAB * height, xB * width, yB * height)
ctx.bezierCurveTo(xControl1BC * width, yControl1BC * height, xControl2BC * width, yControl2BC * height, xC * width, yC * height)
ctx.bezierCurveTo(xControl1CD * width, yControl1CD * height, xControl2CD * width, yControl2CD * height, xD * width, yD * height)
//
ctx.bezierCurveTo(xControl2CD * width, yControl2CD2 * height, xControl1CD * width, yControl1CD2 * height, xC * width, yC2 * height)
ctx.bezierCurveTo(xControl2BC * width, yControl2BC2 * height, xControl1BC * width, yControl1BC2 * height, xB * width, yB2 * height)
ctx.quadraticCurveTo(xControlAB * width, yControlAB2 * height, xA * width, yA * height)
ctx.fill()
