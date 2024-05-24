/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// This files collects several functions specific
// to the piece.
// //////////////////////////////////////////////////
import {
  BASE_FREQ,
  MAX_AMP,
  FADE_IN,
  FADE_OUT,
  SENSOR_OPTIONS,
  SCREEN_UP_VECTOR,
  DISPLAY_TOP_VECTOR,
  TEXT_COLOR
} from './parameters.mjs'

import {
  map,
  rotateVector,
  angleBetweenVectors
} from './mathFunctions.mjs'

import { Oscillator } from './sound.mjs'

function extendBtns (buttons, state) {
  buttons.forEach((btn, i) => {
    Object.assign(btn, { isEnabled: false, index: i })

    btn.enable = function () {
      this.isEnabled = true
      this.classList.remove('dark')
      this.classList.add('light')
    }

    btn.disable = function () {
      this.isEnabled = false
      this.classList.remove('light')
      this.classList.add('dark')
    }

    btn.disable()

    btn.addEventListener('pointerdown', getButtonListener(state))
  })
}

function getButtonListener (state) {
  return event => {
    state.changeTo(event.target.index)
  }
}

function createSoundObjectsFor (state, audioContext) {
  const sounds = state.allStates
    .map(aStateIndex => Oscillator.of({
      freq: (2 ** aStateIndex) * BASE_FREQ, amp: 0.0, fadeIn: FADE_IN, fadeOut: FADE_OUT, context: audioContext
    })
    )

  return sounds
}

function getViewUpdaterFor (buttons, sounds) {
  return state => {
    if (!state.wasNeutral()) sounds[state.previous].stop()

    if (state.isNeutral()) {
      buttons[state.previous]?.disable?.()
    } else {
      const indices = state.allStates.filter(st => st !== state.current)
      sounds[state.current].start()

      buttons
        .filter(btn => indices.includes(btn.index))
        .find(btn => btn.isEnabled)
        ?.disable?.()

      buttons[state.current].enable()
    }
  }
}

function getSensorBarListener (barElement, barPointElement) {
  return event => {
    const endPosition = barElement.offsetWidth - barPointElement.offsetWidth
    const rotationAngle = angleBetweenVectors(
      rotateVector(event.target.quaternion, DISPLAY_TOP_VECTOR),
      DISPLAY_TOP_VECTOR
    )
    const marginLeft = Math.round(map(
      rotationAngle,
      0, Math.PI,
      0, endPosition
    ))
    // console.log("Inside 'getSensorBarListener'", marginLeft)
    barPointElement.style.marginLeft = `${marginLeft}px`
  }
}

function connectSensor (sensor) {
  const promise = new Promise((resolve, reject) => {
    sensor.start()

    sensor.addEventListener('error', reject)
    sensor.addEventListener('activate', resolve, { once: true })
  })

  return promise// .catch(sensorErrorListener)
}

function revealElement (element) {
  return event => {
    element.hidden = false
    return Promise.resolve(true)
  }
}

function attachListenerToState (listener, state) {
  return () => {
    state.attachToListeners(listener)
    return Promise.resolve(true)
  }
}

function addSoundListenerToSensor (sounds, sensor) {
  return () => {
    sensor.addEventListener('reading', getSensorListener(sounds))
    return Promise.resolve(true)
  }
}

function getSensorListener (sounds) {
  const delta = 1 / SENSOR_OPTIONS.frequency

  return event => {
    const rotationAngleForAmp = angleBetweenVectors(
      rotateVector(event.target.quaternion, SCREEN_UP_VECTOR),
      SCREEN_UP_VECTOR
    )
    const amp = MAX_AMP * Math.pow(
      map(
        rotationAngleForAmp,
        0, Math.PI,
        0, 1
      ),
      2
    )

    const rotationAngleForDetune = angleBetweenVectors(
      rotateVector(event.target.quaternion, DISPLAY_TOP_VECTOR),
      DISPLAY_TOP_VECTOR
    )
    const detune = Math.round(map(
      rotationAngleForDetune,
      0, Math.PI,
      -100, 100
    ))

    sounds.forEach(aSound => {
      aSound.setDetune({ detune, dt: delta })
      aSound.setAmp({ amp, dt: delta })
    })
  }
}

function addReadingListenerToSensor (listener, sensor) {
  return () => {
    sensor.addEventListener('reading', listener)
  }
}

function logErrorAfterElement (element) {
  return error => {
    const p = createStyledParagraphWithText(error.toString())
    element.after(p)
  }
}

function createStyledParagraphWithText (text) {
  const p = document.createElement('p')
  p.textContent = text
  p.style.fontSize = '1.1rem'
  p.style.textAlign = 'center'
  p.style.color = TEXT_COLOR
  return p
}

export {
  extendBtns,
  getViewUpdaterFor,
  getButtonListener,
  getSensorListener,
  getSensorBarListener,
  logErrorAfterElement,
  attachListenerToState,
  createSoundObjectsFor,
  connectSensor,
  addSoundListenerToSensor,
  addReadingListenerToSensor,
  revealElement
}
