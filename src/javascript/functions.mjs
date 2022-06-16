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
      aSound.perform('setDetune', { detune, dt: delta })
      aSound.perform('setAmp', { amp, dt: delta })
    })
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

function logErrorAfterElement (element) {
  return event => {
    const msg = getErrorMsg(event)
    const p = createStyledParagraphWithText(msg)
    element.after(p)
  }
}

function getErrorMsg (event) {
  if (event.error.name === 'SecurityError') {
    return `No permissions to use ${event.target.toString()}.`
  } else if (event.error.name === 'NotReadableError') {
    return `${event.target.toString()}  is not available on this device.`
  } else {
    return event.error
  }
}

function createStyledParagraphWithText (text) {
  const p = document.createElement('p')
  p.textContent = text
  p.style.fontSize = '140%'
  p.style.textAlign = 'center'
  p.style.color = 'maroon'
  return p
}

function setBackgroundColorAndBorderToButtons (buttons) {
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

  return event
}

function attachListenerToState (listener, state) {
  return event => {
    state.attachToListeners(listener)
    return event
  }
}

function createSoundObjectsForState (state) {
  return event => {
    const sounds = state.allStates
      .map(aStateIndex => Sound.of({
        type: 'Oscillator',
        name: aStateIndex,
        params: { freq: (aStateIndex + 1) * BASE_FREQ, amp: 0.0, fadeIn: FADE_IN, fadeOut: FADE_OUT }
      })
      )

    return sounds
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

function addSoundListenerToSensor (sensor) {
  return sounds => {
    sensor.addEventListener('reading', getSensorListener(sounds))
    return sounds
  }
}

function addReadingListenerToSensor (listener, sensor) {
  return sounds => {
    sensor.addEventListener('reading', listener)
  }
}

function setHiddenAttributeToElement (bool, element) {
  element.hidden = bool
}

function revealElement (element) {
  return event => {
    setHiddenAttributeToElement(false, element)
    return event
  }
}

export {
  extendBtns,
  getViewUpdater,
  getButtonListener,
  getSensorListener,
  getSensorBarListener,
  logErrorAfterElement,
  setBackgroundColorAndBorderToButtons,
  initSound,
  attachListenerToState,
  createSoundObjectsForState,
  connectSensor,
  addSoundListenerToSensor,
  addReadingListenerToSensor,
  setHiddenAttributeToElement,
  revealElement
}
