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

import {
  Oscillator,
  SoundCoordinator
} from './sound.mjs'

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
  return state
    .allStates
    .map(aStateIndex => SoundCoordinator.of(Oscillator))
}

function getViewUpdaterFor (buttons, sounds, audioContext) {
  return state => {
    if (!state.wasNeutral()) sounds[state.previous].stop({ fadeOut: FADE_OUT })
    if (state.isNeutral()) {
      buttons[state.previous]?.disable?.()
    } else {
      const indices = state.allStates.filter(st => st !== state.current)
      sounds[state.current].start({ freq: (2 ** state.current) * BASE_FREQ, amp: 0.0, detune: 0.0, fadeIn: FADE_IN, context: audioContext })

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

function connectSensor (sensor, main) {
  sensor.start()

  sensor.addEventListener('error', event => { throw Error(event.error) })
  sensor.addEventListener('activate', revealElement(main), { once: true })
}

function revealElement (element) {
  return event => {
    element.hidden = false
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

function logErrorAfterElement (element, document) {
  return error => {
    const p = createStyledParagraphWithText(error.toString(), document)
    element.after(p)
  }
}

function createStyledParagraphWithText (text, document) {
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
  createSoundObjectsFor,
  connectSensor,
  revealElement
}
