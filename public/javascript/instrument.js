/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/instrument.html
// //////////////////////////////////////////////////
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

const state = new State(0, 1, 2)
const buttons = Array.from(document.querySelectorAll('button'))

extendBtns(buttons, state)

// //////////////////////////////////////////////////
addListenerToBody()
  .then(setButtonStyle(buttons))
  .then(initSound)
  .then(attachListenersToState(state, buttons))
  .then(createSoundObjects(state))
  .then(initSensorsAndAttachListeners)
  .catch(console.error)
