/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/instrument.html
// //////////////////////////////////////////////////
import {
  extendBtns,
  addPointerdownListenerToBody,
  setButtonStyle,
  initSound,
  attachListenersToState,
  createSoundObjects,
  initSensorsAndAttachListeners
} from './functionsForPiece.mjs'

import { State } from './state.mjs'

const state = new State(0, 1, 2)
const buttons = Array.from(document.querySelectorAll('button'))

extendBtns(buttons, state)

const body = document.querySelector('body')

addPointerdownListenerToBody(body)
  .then(setButtonStyle(buttons))
  .then(initSound)
  .then(attachListenersToState(state, buttons))
  .then(createSoundObjects(state))
  .then(initSensorsAndAttachListeners(document))
  .catch(console.error)
