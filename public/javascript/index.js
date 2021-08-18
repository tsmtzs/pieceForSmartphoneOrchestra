/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/index.html
// //////////////////////////////////////////////////
import {
  baseFreq,
  refToneAmp,
  fadeIn,
  fadeOut
} from './parameters.mjs'

import {
  extendBtns,
  addListenerToBody,
  setButtonStyle,
  initSound,
  attachListenersToState,
  createSoundObjects,
  initSensorsAndAttachListeners
} from './functionsForPiece.mjs'

import { State } from './state.mjs'

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

// Base tone 'pointer' listener function.
// Adapted from
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
const switchClickEvent = sound => {
  return event => {
    const el = event.target

    if (el.getAttribute('aria-checked') === 'true') {
      el.setAttribute('aria-checked', 'false')
      sound.stop()
    } else {
      el.setAttribute('aria-checked', 'true')
      sound.start()
    }
  }
}

// New 'State' instance with one state 0 and neutral state -1
const state = new State(0)
const instrButton = document.querySelector('#instrument')
const refButton = document.querySelector('#refTone')

extendBtns([instrButton], state)

// //////////////////////////////////////////////////
addListenerToBody()
  .then(setButtonStyle([instrButton, refButton]))
  .then(initSound)
  .then(sound => {
    const refSound = sound.of({
      type: 'Oscillator',
      name: 'refSound',
      params: { freq: baseFreq, amp: refToneAmp, fadeIn: fadeIn, fadeOut: fadeOut }
    })

    // Adapted from
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
    document.querySelectorAll('.switch').forEach(theSwitch => {
      theSwitch.addEventListener('pointerdown', switchClickEvent(refSound), false)
    })

    return sound
  })
  .then(attachListenersToState(state, [instrButton]))
  .then(createSoundObjects(state))
  .then(initSensorsAndAttachListeners)
  .catch(console.error)
