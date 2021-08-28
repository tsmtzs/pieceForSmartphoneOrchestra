/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// This file collects common arguments
// //////////////////////////////////////////////////
// Sound:
const baseFreq = 1244.5079348883 // Eflat 6
const maxAmp = 0.9
const refToneAmp = 0.3
const fadeIn = 0.05
const fadeOut = 0.05
// Button
const btnColorOn = 'darkorange'
const btnColorOff = 'darkslategray'
// Sensors
const sensorOptions = { frequency: 60, referenceFrame: 'device' }

export {
  baseFreq,
  maxAmp,
  refToneAmp,
  fadeIn,
  fadeOut,
  btnColorOn,
  btnColorOff,
  sensorOptions
}
