/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Parameters and constants.
// //////////////////////////////////////////////////
// Sound:
const BASE_FREQ = 1244.5079348883 // Eflat 6
const MAX_AMP = 0.9
const REFTONE_AMP = 0.3
const FADE_IN = 0.05
const FADE_OUT = 0.05
// Button
const BTN_COLOR_ON = 'darkorange'
const BTN_COLOR_OFF = 'darkslategray'
const BTN_BORDER = '0'
// Sensors
const SENSOR_OPTIONS = { frequency: 60, referenceFrame: 'device' }
// Display
const SCREEN_UP_VECTOR = [0, 0, 1]
const DISPLAY_TOP_VECTOR = [0, 1, 0]

export {
  BASE_FREQ,
  MAX_AMP,
  REFTONE_AMP,
  FADE_IN,
  FADE_OUT,
  BTN_COLOR_ON,
  BTN_COLOR_OFF,
  BTN_BORDER,
  SENSOR_OPTIONS,
  SCREEN_UP_VECTOR,
  DISPLAY_TOP_VECTOR
}
