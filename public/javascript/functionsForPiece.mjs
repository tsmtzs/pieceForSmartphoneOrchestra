/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// This files collects several functions specific
// to the piece.
// //////////////////////////////////////////////////
import {
  baseFreq,
  maxAmp,
  fadeIn,
  fadeOut,
  btnColorOn,
  btnColorOff,
  sensorOptions
} from './parameters.mjs'

import {
  map,
  rotateVector,
  angleBetweenVectors
} from './generalFunctions.mjs'

import { Sound } from './sound.mjs'

function extendBtns (buttons, state) {
  // Extend 'Button' objects and add event listeners
  buttons.forEach((btn, i) => {
    Object.assign(btn, { isEnabled: false, index: i })

    btn.enable = function () {
      this.isEnabled = true

      // Change button color
      this.style.backgroundColor = btnColorOn
    }

    btn.disable = function () {
      this.isEnabled = false

      // Change button color
      this.style.backgroundColor = btnColorOff
    }

    btn.addEventListener('pointerdown', buttonListenerFunc(state))
  })
}

function viewUpdaterFunc (buttons, sound) {
  let previousState = -1

  return state => {
    // console.log('*** State', state, '\tOldState:', previousState, '\tSound:', sound)
    if (previousState > -1) sound.stop(previousState)

    if (state.hasChanged) {
      const indices = Array.from(state.all).filter(st => st !== state.current)

      // Set 'previousState'
      previousState = state.current

      // start new synth
      sound.start(state.current)

      // Change color of enabled buttons and disable them (if any)
      buttons
        .filter(btn => indices.includes(btn.index))
        .find(btn => btn.isEnabled)
        ?.disable()

      buttons[state.current].enable()
    } else {
      buttons[previousState]?.disable()

      console.log('State did not change')
    }
  }
}

function buttonListenerFunc (state) {
  return event => {
    state.change(event.target.index)
  }
}

const screenUpVector = [0, 0, 1]
const deviceHeadVector = [0, -1, 0]

function sensorListenerFunc (sounds, maxAmp, sensorOptions) {
  const delta = 1 / sensorOptions.frequency

  return event => {
    const amp = maxAmp * Math.pow(
      map(
        angleBetweenVectors(
          rotateVector(event.target.quaternion, screenUpVector),
          screenUpVector
        ),
        0, Math.PI,
        0, 1
      ),
      2
    )

    const detune = Math.round(map(
      angleBetweenVectors(
        rotateVector(event.target.quaternion, deviceHeadVector),
        deviceHeadVector
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

function sensorBarListenerFunc (document) {
  const bar = document.querySelector('#bar')

  if (bar) {
    const position = document.querySelector('#barPoint')
    const endPosition = bar.offsetWidth - position.offsetWidth

    return event => {
      const marginLeft = Math.round(map(
        angleBetweenVectors(
          rotateVector(event.target.quaternion, deviceHeadVector),
          deviceHeadVector
        ),
        0, Math.PI,
        0, endPosition
      ))
      // console.log("Inside 'sensorBarListenerFunc'", marginLeft)
      position.style.marginLeft = `${marginLeft}px`
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
      btn.style.backgroundColor = btnColorOff
      btn.style.border = '0'
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
    state.listeners.attach(viewUpdaterFunc(buttons, sound))
    return sound
  }
}

function createSoundObjects (state) {
  return sound => {
    // CAUTION: state.all is a Set instance of positive integers.
    const sounds = Array.from(state.all)
      .map(aStateIndex => sound.of({
        type: 'Oscillator',
        name: aStateIndex,
        params: { freq: (aStateIndex + 1) * baseFreq, amp: 0.0, fadeIn: fadeIn, fadeOut: fadeOut }
      })
      )

    return sounds
  }
}

function initSensorsAndAttachListeners (document) {
  return sounds => {
    const sensor = new window.AbsoluteOrientationSensor(sensorOptions)

    sensor.start()
    sensor.addEventListener('error', sensorErrorListener)
    sensor.addEventListener('reading', sensorListenerFunc(sounds, maxAmp, sensorOptions))
    sensor.addEventListener('reading', sensorBarListenerFunc(document))

    return sensor
  }
}

export {
  extendBtns,
  viewUpdaterFunc,
  buttonListenerFunc,
  sensorListenerFunc,
  sensorErrorListener,
  addListenerToBody,
  setButtonStyle,
  initSound,
  attachListenersToState,
  createSoundObjects,
  initSensorsAndAttachListeners
}
