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
  attachListenerToState,
  createSoundObjectsForState,
  connectSensor,
  addSoundListenerToSensor,
  addReadingListenerToSensor,
  logErrorAfterElement,
  revealElement,
  getViewUpdater,
  getSensorBarListener
} from './functions.mjs'

import { Sound } from './sound.mjs'
import { State } from './state.mjs'

const state = new State(0, 1, 2)
const buttons = Array.from(document.querySelectorAll('button'))

extendBtns(buttons, state)

const body = document.querySelector('body')
const main = document.querySelector('main')
const bar = document.querySelector('#bar')
const position = document.querySelector('#barPoint')
const sensor = new window.AbsoluteOrientationSensor()
const updateView = getViewUpdater(buttons, Sound)
const updateBar = getSensorBarListener(bar, position)

connectSensor(sensor)
  .then(setBackgroundColorAndBorderToButtons(buttons))
  .then(revealElement(main))
  .then(initSound)
  .then(attachListenerToState(updateView, state))
  .then(createSoundObjectsForState(state))
  .then(addSoundListenerToSensor(sensor))
  .then(addReadingListenerToSensor(updateBar, sensor))
  .catch(logErrorAfterElement(body))
