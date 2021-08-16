/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for smartphone orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/index.html
// //////////////////////////////////////////////////
import {
  viewUpdaterFunc,
  buttonListenerFunc,
  sensorListenerFunc
} from './functionsForPiece.mjs'

import { State } from './state.mjs'
import { Synth } from './synth.mjs'

// Register the ServiveWorker
// from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
// if ('serviceWorker' in navigator) {
//   // Register a service worker hosted at the root of the
//   // site using the default scope.
//   navigator.serviceWorker
//     .register('/sw.js')
//   // .then(registration => console.log('Service worker registration succeeded:', registration))
//     .catch(error => console.log('Service worker registration failed:', error))
// } else {
//   console.log('Service workers are not supported.')
// }

// //////////////////////////////////////////////////
// Set parameters
// //////////////////////////////////////////////////
// Sound ////////////////////////////////////////
// Eflat 6
const baseFreq = 1244.5079348883
const maxAmp = 0.9
const refToneAmp = 0.1
const fadeIn = 1
const fadeOut = 1
// Button //////////////////////////////////////
const btnColorOn = 'darkorange'
const btnColorOff = 'darkslategray'
const body = document.querySelector('body')
// Base tone 'pointer' listener function.
// Adapted from
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
const switchClickEvent = (sound, freq) => {
  return event => {
    const el = event.target

    if (el.getAttribute('aria-checked') === 'true') {
      el.setAttribute('aria-checked', 'false')
      // stop sound
      sound.stop(0)
    } else {
      el.setAttribute('aria-checked', 'true')
      // play sound
      sound.play(0, freq)
    }
  }
}
// /////////////////////////////////////////////
// Initialize State
// New 'State' object with one state 0 and neutral state -1
const state = new State(0)
// Buttons
const instrButton = document.querySelector('#instrument')
const refButton = document.querySelector('#refTone')

// Extend 'instrButton' object and add event listeners
Object.assign(instrButton, { isEnabled: false, index: 0 })

instrButton.enable = function () {
  this.isEnabled = true

  // Change button color
  this.style.backgroundColor = btnColorOn
}

instrButton.disable = function () {
  this.isEnabled = false

  // Change button color
  this.style.backgroundColor = btnColorOff
}

instrButton.addEventListener('pointerdown', buttonListenerFunc(state))

// Sensor //////////////////////////////////////
const sensorOptions = { frequency: 60, referenceFrame: 'device' }
const sensor = new window.AbsoluteOrientationSensor(sensorOptions)
const screenUpVector = [0, 0, 1]
const deviceHeadVector = [0, -1, 0]

// //////////////////////////////////////////////////
;(new Promise(resolve => {
  body.addEventListener('pointerdown', resolve, { once: true })
})
)
  .then(event => {
    [instrButton, refButton].forEach(btn => {
      btn.style.backgroundColor = btnColorOff
      btn.style.border = '0'
    })

    return event
  })
  .then(event => {
    const audioCtx = new AudioContext()
    const sound = new Synth(baseFreq, fadeIn, fadeOut, audioCtx)
    const refSound = new Synth(baseFreq, fadeIn, fadeOut, audioCtx)

    state.listeners.attach(viewUpdaterFunc([instrButton], sound))

    // Set 'amp' for base tone.
    refSound.amp = refToneAmp

    // Add 'pointer' listener on base note button.
    // Adapted from
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
    document.querySelectorAll('.switch').forEach(function (theSwitch) {
      theSwitch.addEventListener('pointerdown', switchClickEvent(refSound, baseFreq), false)
    })

    return sound
  })
  .then(sound => {
    // Start sensor.
    // From
    // https://w3c.github.io/orientation-sensor/
    sensor.start()

    sensor.addEventListener('error', event => {
      if (event.error.name === 'SecurityError') {
        console.error(`No permissions to use ${event.target.toString()}.`)
      } else if (event.error.name === 'NotReadableError') {
        console.error(`${event.target.toString()}  is not available on this device.`)
      } else {
        console.error(event.error)
      }
    })

    sensor.addEventListener('reading', sensorListenerFunc(sound, maxAmp, sensorOptions, screenUpVector, deviceHeadVector))
  })
  .catch(console.error)
