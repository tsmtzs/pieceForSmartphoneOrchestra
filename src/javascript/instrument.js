/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/instrument.html
// //////////////////////////////////////////////////
import {
  extendBtns,
  setBackgroundColorAndBorderToButtons,
  initSound,
  attachListenersToState,
  createSoundObjects,
  connectSensor,
  addReadingListenersToSensor,
  getSensorActivateListener,
  logErrorAfterElement,
  setHiddenAttributeToElement,
  revealElement
} from './functionsForPiece.mjs'

import { State } from './state.mjs'

const state = new State(0, 1, 2)
const buttons = Array.from(document.querySelectorAll('button'))

extendBtns(buttons, state)

const body = document.querySelector('body')
const main = document.querySelector('main')
const bar = document.querySelector('#bar')
const position = document.querySelector('#barPoint')
const sensor = new window.AbsoluteOrientationSensor()

connectSensor(sensor)
  .then(getSensorActivateListener(bar))
  .then(setBackgroundColorAndBorderToButtons(buttons))
  .then(revealElement(main))
  .then(initSound)
  .then(attachListenersToState(state, buttons))
  .then(createSoundObjects(state))
  .then(addReadingListenersToSensor(sensor, bar, position))
  .catch(logErrorAfterElement(body))
