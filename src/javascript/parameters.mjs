/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Parameters and constants.
// //////////////////////////////////////////////////
const rootElementStyle = getComputedStyle(document.querySelector(':root'))
const get = string => rootElementStyle?.getPropertyValue(string)

const BACKGROUND_COLOR = get('--background-color') ?? '#393a46'
const TEXT_COLOR = get('--text-color') ?? '#f2f2f2'
// Sound:
const BASE_FREQ = 1244.5079348883 // Eflat 6
const MAX_AMP = 0.9
const FADE_IN = 0.05
const FADE_OUT = 0.05
// Button
const SHINY_COLOR = get('--shiny-color') ?? '#f96d00'
const DARK_COLOR = get('--dark-color') ?? '#222831'
// Sensors
const SENSOR_OPTIONS = { frequency: 60, referenceFrame: 'device' }
// Display
const SCREEN_UP_VECTOR = [0, 0, 1]
const DISPLAY_TOP_VECTOR = [0, 1, 0]
export {
  BASE_FREQ,
  MAX_AMP,
  FADE_IN,
  FADE_OUT,
  BACKGROUND_COLOR,
  TEXT_COLOR,
  SHINY_COLOR,
  DARK_COLOR,
  SENSOR_OPTIONS,
  SCREEN_UP_VECTOR,
  DISPLAY_TOP_VECTOR
}
