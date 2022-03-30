/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/index.html
// //////////////////////////////////////////////////
import {
  extendBtns,
  connectSensor,
  logErrorAfterElement,
  getSensorActivateListener,
  revealElement,
  setBackgroundColorAndBorderToButtons,
  initSound,
  attachListenersToState,
  createSoundObjects,
  createReferenceSoundAndAddPointerdownListener
} from './functionsForPiece.mjs'

import { State } from './state.mjs'

// Register the ServiveWorker
// from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(new URL('../serviceWorker.js', import.meta.url), { scope: '/' })
    .catch(error => console.log('Service worker registration failed:', error))
} else {
  console.log('Service workers are not supported.')
}

const state = new State(0)
const instrButton = document.querySelector('#instrument')
const refButton = document.querySelector('#refTone')

extendBtns([instrButton], state)

const body = document.querySelector('body')
const bar =  document.querySelector('#bar')
const buttonSection = document.querySelector('#buttons')
const sensor = new window.AbsoluteOrientationSensor()

connectSensor(sensor)
  .then(getSensorActivateListener(bar))
  .then(setBackgroundColorAndBorderToButtons([instrButton, refButton]))
  .then(revealElement(buttonSection))
  .then(initSound)
  .then(attachListenersToState(state, [instrButton]))
  .then(createReferenceSoundAndAddPointerdownListener)
  .then(createSoundObjects(state))
  .catch(logErrorAfterElement(body))
