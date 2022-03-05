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
  BTN_COLOR_ON,
  BTN_COLOR_OFF,
  BTN_BORDER,
  SENSOR_OPTIONS,
  SCREEN_UP_VECTOR,
  DISPLAY_TOP_VECTOR
} from './parameters.mjs'

import {
  map,
  rotateVector,
  angleBetweenVectors
} from './mathFunctions.mjs'

import { Sound } from './sound.mjs'

function extendBtns (buttons, state) {
  buttons.forEach((btn, i) => {
    Object.assign(btn, { isEnabled: false, index: i })

    btn.enable = function () {
      this.isEnabled = true
      this.style.backgroundColor = BTN_COLOR_ON
    }

    btn.disable = function () {
      this.isEnabled = false
      this.style.backgroundColor = BTN_COLOR_OFF
    }

    btn.addEventListener('pointerdown', getButtonListener(state))
  })
}

function getButtonListener (state) {
  return event => {
    state.changeTo(event.target.index)
  }
}

function getViewUpdater (buttons, sound) {
  return state => {
    if (!state.wasNeutral()) sound.stop(state.previous)

    if (state.isNeutral()) {
      buttons[state.previous]?.disable?.()
    } else {
      const indices = state.allStates.filter(st => st !== state.current)
      sound.start(state.current)

      buttons
        .filter(btn => indices.includes(btn.index))
        .find(btn => btn.isEnabled)
        ?.disable?.()

      buttons[state.current].enable()
    }
  }
}

function getSensorListener (sounds) {
  const delta = 1 / SENSOR_OPTIONS.frequency

  return event => {
    const amp = MAX_AMP * Math.pow(
      map(
        angleBetweenVectors(
          rotateVector(event.target.quaternion, SCREEN_UP_VECTOR),
          SCREEN_UP_VECTOR
        ),
        0, Math.PI,
        0, 1
      ),
      2
    )

    const detune = Math.round(map(
      angleBetweenVectors(
        rotateVector(event.target.quaternion, DISPLAY_TOP_VECTOR),
        DISPLAY_TOP_VECTOR
      ),
      0, Math.PI,
      -100, 100
    ))

    sounds.forEach(aSound => {
      aSound.perform('setDetune', { detune: detune, dt: delta })
      aSound.perform('setAmp', { amp: amp, dt: delta })
    })
  }
}

function getSensorBarListener (barElement, barPointElement) {
  return event => {
    const endPosition = barElement.offsetWidth - barPointElement.offsetWidth

    const marginLeft = Math.round(map(
      angleBetweenVectors(
        rotateVector(event.target.quaternion, DISPLAY_TOP_VECTOR),
        DISPLAY_TOP_VECTOR
      ),
      0, Math.PI,
      0, endPosition
    ))
    // console.log("Inside 'getSensorBarListener'", marginLeft)
    barPointElement.style.marginLeft = `${marginLeft}px`
  }
}

function getSensorActivateListener (document) {
  // TODO: duplication here with 'getSensorBarListener'.
  // 'bar' is read twice.
  const bar = document.querySelector('#bar')
  return event => {
    if (bar) {
      bar.style.visibility = 'visible'
    }
  }
}

function sensorErrorListener (event) {
  if (event.error.name === 'SecurityError') {
    console.error(`No permissions to use ${event.target.toString()}.`)
  } else if (event.error.name === 'NotReadableError') {
    console.error(`${event.target.toString()}  is not available on this device.`)
    alertUser(`${event.target.constructor.name}  is not available on this device.`)
  } else {
    console.error(event.error)
  }
}

function alertUser (msg) {
  if (!sessionStorage.isRevealed) {
    alert(msg)
    sessionStorage.isRevealed = true
  }
}

function addListenerToBody () {
  const body = document.querySelector('body')

  return new Promise(resolve => {
    body.addEventListener('pointerdown', resolve, { once: true })
  })
}

function setButtonStyle (buttons) {
  return event => {
    buttons.forEach(btn => {
      btn.style.backgroundColor = BTN_COLOR_OFF
      btn.style.border = BTN_BORDER
    })

    return event
  }
}

function initSound (event) {
  Sound.init()

  return Sound
}

function attachListenersToState (state, buttons) {
  return sound => {
    state.attachToListeners(getViewUpdater(buttons, sound))
    return sound
  }
}

function createSoundObjects (state) {
  return sound => {
    const sounds = state.allStates
      .map(aStateIndex => sound.of({
        type: 'Oscillator',
        name: aStateIndex,
        params: { freq: (aStateIndex + 1) * BASE_FREQ, amp: 0.0, fadeIn: FADE_IN, fadeOut: FADE_OUT }
      })
      )

    return sounds
  }
}

function initSensorsAndAttachListeners (document) {
  return sounds => {
    const sensor = new window.AbsoluteOrientationSensor(SENSOR_OPTIONS)
    const bar = document.querySelector('#bar')
    const position = document.querySelector('#barPoint')

    sensor.start()
    sensor.addEventListener('error', sensorErrorListener)
    sensor.addEventListener('activate', getSensorActivateListener(document), { once: true })
    sensor.addEventListener('reading', getSensorListener(sounds))
    sensor.addEventListener('reading', getSensorBarListener(bar, position))

    return sensor
  }
}

export {
  extendBtns,
  getViewUpdater,
  getButtonListener,
  getSensorListener,
  getSensorBarListener,
  sensorErrorListener,
  addListenerToBody,
  setButtonStyle,
  initSound,
  attachListenersToState,
  createSoundObjects,
  initSensorsAndAttachListeners
}
