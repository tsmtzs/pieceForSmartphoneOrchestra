/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/index.html
// //////////////////////////////////////////////////
import {
  viewUpdaterFunc,
  buttonListenerFunc,
  sensorListenerFunc,
  sensorErrorListener
} from './functionsForPiece.mjs'

import { State } from './state.mjs'
import { Sound } from './sound.mjs'

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
const refToneAmp = 0.3
const fadeIn = 1
const fadeOut = 1
// Button //////////////////////////////////////
const btnColorOn = 'darkorange'
const btnColorOff = 'darkslategray'
const body = document.querySelector('body')
// Base tone 'pointer' listener function.
// Adapted from
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
const switchClickEvent = sound => {
  return event => {
    const el = event.target

    if (el.getAttribute('aria-checked') === 'true') {
      el.setAttribute('aria-checked', 'false')
      // stop sound
      sound.stop()
    } else {
      el.setAttribute('aria-checked', 'true')
      // play sound
      sound.start()
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
    Sound.init()

    // CAUTION: state.all is a Set instance of positive integers.
    const testSounds = Array.from(state.all)
      .map(aStateIndex => Sound.of({
        type: 'Oscillator',
        name: aStateIndex,
        params: { freq: (aStateIndex + 1) * baseFreq, amp: maxAmp, fadeIn: fadeIn, fadeOut: fadeOut }
      })
      )
    const refSound = Sound.of({
      type: 'Oscillator',
      name: 'refSound',
      params: { freq: baseFreq, amp: refToneAmp, fadeIn: fadeIn, fadeOut: fadeOut }
    })

    state.listeners.attach(viewUpdaterFunc([instrButton], Sound))

    // Adapted from
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
    document.querySelectorAll('.switch').forEach(function (theSwitch) {
      theSwitch.addEventListener('pointerdown', switchClickEvent(refSound), false)
    })

    return testSounds
  })
  .then(sounds => {
    sensor.start()
    sensor.addEventListener('error', sensorErrorListener)
    sensor.addEventListener('reading', sensorListenerFunc(sounds, maxAmp, sensorOptions))
  })
  .catch(console.error)
