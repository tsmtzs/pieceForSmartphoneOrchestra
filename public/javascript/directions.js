// //////////////////////////////////////////////////
//	Piece for smartphone orchestra
//			by Tassos Tsesmetzis
//
// Main JavaScript file for views/directions.html
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// Import statements.
// //////////////////////////////////////////////////
import { map } from './generalFunctions.mjs';

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Coordinates
const innerPos = (a, b, x) => map(x, 0, 1, a, b);
const xA = 0.13, yA = 0.5, xB = 0.25, yBDiv = 0.04, yB = yA - yBDiv, xC = 0.45, yCDiv = 0.4, yC = yA - yCDiv, xD = 0.9, yD = yA;
const yB2 = yA + yBDiv, yC2 = yA + yCDiv;
const xControlAB = innerPos(xA, xB, 0.9), yControlAB_div = 0.005, yControlAB = yA - yControlAB_div;
const xControl1BC = innerPos(xB, xC, 0.4), yControl1BC_div = 0.1, yControl1BC = yA - yControl1BC_div;
const xControl2BC = innerPos(xB, xC, 0.65), yControl2BC_div = 0.4, yControl2BC = yA - yControl2BC_div;
const xControl1CD = innerPos(xC, xD, 0.3), yControl1CD_div = 0.45, yControl1CD = yA - yControl1CD_div;
const xControl2CD = innerPos(xC, xD, 0.45), yControl2CD_div = 0.05, yControl2CD = yA - yControl2CD_div;
const yControlAB2 = yA + yControlAB_div, yControl1BC2 = yA + yControl1BC_div, yControl2BC2 = yA + yControl2BC_div;
const yControl1CD2 = yA + yControl1CD_div, yControl2CD2 = yA + yControl2CD_div;

// Gradient
const radialGrad = ctx.createRadialGradient(0.55 * width, 0.5 * height, 0.0 * width, 0.9 * height, 0.4 * height, 0.88 * width);
radialGrad.addColorStop(0, '#000000');
radialGrad.addColorStop(0.5, '#FFFFFF');

// Background
ctx.fillStyle = 'seashell';
ctx.fillRect(0,0, width, height);
// Font
ctx.fillStyle = 'maroon';
ctx.font = '0.9rem serif';
ctx.textBaseline = 'middle';
ctx.fillText('START', 0.01 * width, 0.5 * height);
ctx.fillText('END', 0.9 * width, 0.5 * height);
//
ctx.fillStyle = radialGrad;
ctx.beginPath();
ctx.moveTo(xA * width, yA * height);
ctx.quadraticCurveTo(xControlAB * width, yControlAB * height, xB * width, yB * height);
ctx.bezierCurveTo(xControl1BC * width, yControl1BC * height, xControl2BC * width, yControl2BC * height, xC * width, yC * height);
ctx.bezierCurveTo(xControl1CD * width, yControl1CD * height, xControl2CD * width, yControl2CD * height, xD * width, yD * height);
//
ctx.bezierCurveTo(xControl2CD * width, yControl2CD2 * height, xControl1CD * width, yControl1CD2 * height, xC * width, yC2 * height);
ctx.bezierCurveTo(xControl2BC * width, yControl2BC2 * height, xControl1BC * width, yControl1BC2 * height, xB * width, yB2 * height);
ctx.quadraticCurveTo(xControlAB * width, yControlAB2 * height, xA * width, yA * height);
ctx.fill();
