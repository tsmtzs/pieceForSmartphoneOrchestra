/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// This files collects several functions specific
// to the piece.
// //////////////////////////////////////////////////
import {
  map,
  rotateVector,
  angleBetweenVectors
} from './generalFunctions.mjs'

function viewUpdaterFunc (buttons, sound) {
  let previousState = -1

  return state => {
    console.log('*** State', state, '\tOldState:', previousState)
    if (previousState > -1) sound.stop(previousState)

    if (state.hasChanged) {
      const indices = Array.from(state.all).filter(st => st !== state.current)

      // Set 'previousState'
      previousState = state.current

      // start new synth
      sound.start(state.current)

      // Change color of enabled buttons and disable (if any)
      const button = buttons.filter(btn => indices.includes(btn.index))
        .find(btn => btn.isEnabled)

      if (button) button.disable()

      buttons[state.current].enable()
    } else {
      // Change color to button
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

    const detune = map(
      angleBetweenVectors(
        rotateVector(event.target.quaternion, deviceHeadVector),
        deviceHeadVector
      ),
      0, Math.PI,
      -100, 100
    )

    sounds.forEach(aSound => {
      aSound.perform('setDetune', { detune: detune, dt: delta })
      aSound.perform('setAmp', { amp: amp, dt: delta })
    })
  }
}

function sensorErrorListener (event) {
  if (event.error.name === 'SecurityError') {
    console.error(`No permissions to use ${event.target.toString()}.`)
  } else if (event.error.name === 'NotReadableError') {
    console.error(`${event.target.toString()}  is not available on this device.`)
  } else {
    console.error(event.error)
  }
}

export {
  viewUpdaterFunc,
  buttonListenerFunc,
  sensorListenerFunc,
  sensorErrorListener
}
