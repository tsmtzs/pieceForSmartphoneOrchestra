/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/instrument.html
// //////////////////////////////////////////////////
import {
  extendBtns,
  createSoundObjectsFor,
  getViewUpdaterFor,
  getSensorBarListener,
  connectSensor,
  revealElement,
  attachListenerToState,
  addSoundListenerToSensor,
  addReadingListenerToSensor,
  logErrorAfterElement
} from './functions.mjs'

import {
  SENSOR_OPTIONS
} from './parameters.mjs'

import { State } from './state.mjs'

const state = new State(0, 1, 2)
const buttons = Array.from(document.querySelectorAll('button'))
extendBtns(buttons, state)

const body = document.querySelector('body')
const main = document.querySelector('main')
const bar = document.querySelector('#bar')
const position = document.querySelector('#barPoint')

const sensor = new window.RelativeOrientationSensor(SENSOR_OPTIONS)
const context = new AudioContext()

const sounds = createSoundObjectsFor(state, context)
const updateView = getViewUpdaterFor(buttons, sounds)
const updateBar = getSensorBarListener(bar, position)

connectSensor(sensor)
  .then(revealElement(main))
  .then(attachListenerToState(updateView, state))
  .then(addSoundListenerToSensor(sounds, sensor))
  .then(addReadingListenerToSensor(updateBar, sensor))
  .catch(logErrorAfterElement(body))
