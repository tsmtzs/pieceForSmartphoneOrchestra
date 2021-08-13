/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for smartphone orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/piece.html
// //////////////////////////////////////////////////
import {
  viewUpdaterFunc,
  buttonListenerFunc,
  sensorListenerFunc
} from './functionsForPiece.mjs'

import State from './state.mjs'
import Synth from './synth.mjs'

// //////////////////////////////////////////////////
// Set parameters
// //////////////////////////////////////////////////
// Sound ////////////////////////////////////////
// const audioCtx = new AudioContext()
// Eflat 6
const baseFreq = 1244.5079348883
const maxAmp = 0.9
const fadeIn = 1
const fadeOut = 1
// Button //////////////////////////////////////
const btnColorOn = 'darkorange'
const btnColorOff = 'darkslategray'
// Toggle full screen
const body = document.getElementsByTagName('body')[0]

// /////////////////////////////////////////////
// Initialize State
// New 'State' object with states 0, 1, 2 and neutral state -1
const state = new State(0, 1, 2)
// Collect buttons
const buttons = Array.from(document.getElementsByTagName('button'))

// Extend 'Button' objects and add event listeners
buttons.forEach((btn, i) => {
  Object.assign(btn, { isEnabled: false, index: i })

  btn.enable = function () {
    this.isEnabled = true

    // Change button color
    this.style.backgroundColor = btnColorOn
  }

  btn.disable = function () {
    this.isEnabled = false

    // Change button color
    this.style.backgroundColor = btnColorOff
  }

  btn.addEventListener('clickdown', buttonListenerFunc(state))
})

// Sensor //////////////////////////////////////
const sensorOptions = { frequency: 60, referenceFrame: 'screen' }
const sensor = new window.AbsoluteOrientationSensor(sensorOptions)
// This vector will be rotated as the user moves the device.
const screenUpVector = [0, 0, 1]
// This vector will be rotated as the user moves the device.
const deviceHeadVector = [0, 1, 0]
// //////////////////////////////////////////////////

// Enable buttons when user points on title
;(() => new Promise(resolve => {
  body.addEventListener('pointerdown', resolve, { once: true })
})
)()
  .then(event => {
    buttons.forEach(btn => {
      btn.style.backgroundColor = btnColorOff
      btn.style.border = '0'
    })

    return event
  })
  .then(event => {
    const audioCtx = new AudioContext()
    const sound = new Synth(baseFreq, fadeIn, fadeOut, audioCtx)

    state.listeners.attach(viewUpdaterFunc(buttons, sound))

    return sound
  })
  .then(sound => {
    // //////////////////////////////////////////////////
    // from
    // https://w3c.github.io/orientation-sensor/
    sensor.start()

    sensor.addEventListener('error', event => {
      if (event.error.name === 'SecurityError') {
        console.log('No permissions to use AbsoluteOrientationSensor.')
      }
    })

    sensor.addEventListener('reading', sensorListenerFunc(sound, maxAmp, sensorOptions, screenUpVector, deviceHeadVector))

    return sound
  })
  .catch(console.error)
