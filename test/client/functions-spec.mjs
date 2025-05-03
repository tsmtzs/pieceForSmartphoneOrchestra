/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
//        Piece For Smartphone Orchestra
//
// Tests for module functionsForPiece.mjs.
// //////////////////////////////////////////////////
import './globalObjectFakes.mjs'
import {
  getButtonListener,
  extendBtns,
  getViewUpdaterFor,
  getSensorListener,
  getSensorBarListener,
  attachListenerToState,
  addSoundListenerToSensor,
  addReadingListenerToSensor
} from '../../src/javascript/functions.mjs'

import sinon from 'sinon'

import { expect } from 'chai'

describe("Tests for module 'functionsForPiece'.", function () {
  describe("Function 'getButtonListener'.", function () {
    let state
    let listener
    let event

    beforeEach(function () {
      event = { target: { index: 0 } }
      state = {
        changeTo: sinon.fake()
      }
      listener = getButtonListener(state)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Should return a Function object.', function () {
      expect(listener.constructor).to.be.a('function')
    })

    it("The returned function, when called,  should send the message 'changeTo' to function's argument.", function () {
      listener(event)
      expect(state.changeTo.calledOnce).to.be.true
    })
  })

  describe("Function 'extendBtns'.", function () {
    let button
    let state

    beforeEach(function () {
      button = {
        style: { },
        addEventListener: sinon.fake(),
        classList: {
          remove: sinon.fake(),
          add: sinon.fake()
        }
      }
      state = { }
    })

    afterEach(() => {
      sinon.restore()
    })

    it("Should add the property 'isEnabled' to each button of the 'buttons' argument.", function () {
      expect(button).to.not.have.property('isEnabled')

      extendBtns([button], state)
      expect(button).to.have.property('isEnabled')
    })

    it("Should add the property 'index' to each button of the 'buttons' argument.", function () {
      expect(button).to.not.have.property('index')

      extendBtns([button], state)
      expect(button).to.have.property('index', 0)
    })

    it("Should add the properties 'enable' and 'disable' to each button of the 'buttons' argument.", function () {
      expect(button).to.not.have.property('enable')
      expect(button).to.not.have.property('disable')

      extendBtns([button], state)
      expect(button).to.have.property('enable').which.is.a('function')
      expect(button).to.have.property('disable').which.is.a('function')
    })

    it("Should call 'addEventListener' to each button of the 'buttons' argument.", function () {
      extendBtns([button], state)
      expect(button.addEventListener.callCount).to.equal(1)
      expect(button.addEventListener.firstArg).to.equal('pointerdown')
      expect(button.addEventListener.lastArg).to.be.a('function')
    })
  })

  describe("Function 'getViewUpdaterFor'.", function () {
    let listener
    let btn1, btn2, btn3
    let enable, disable
    let start, stop
    let soundFactory

    beforeEach(function () {
      disable = sinon.fake()
      enable = sinon.fake()
      btn1 = {
        enable,
        disable,
        isEnabled: true,
        index: 0
      }
      btn2 = {
        enable,
        disable,
        isEnabled: true,
        index: 1
      }
      btn3 = {
        enable,
        disable,
        isEnabled: false,
        index: 2
      }

      start = sinon.fake()
      stop = sinon.fake()
      soundFactory = () => {
        return {
          start,
          stop
        }
      }

      const buttons = [btn1, btn2, btn3]
      listener = getViewUpdaterFor(buttons, buttons.map(() => soundFactory()))
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Should return a Function instance.', function () {
      const listener = getViewUpdaterFor()

      expect(listener).to.be.a('function')
    })

    it('The returned function, when called, should stop the sound at index state.previous, IF previous state is not neutral.', function () {
      const state = {
        previous: 0,
        wasNeutral: sinon.fake.returns(false),
        isNeutral: sinon.fake.returns(true)
      }
      listener(state)
      expect(state.wasNeutral.calledOnce).to.be.true
      expect(stop.calledOnce).to.be.true
    })

    it('The returned function, when called, should NOT stop any sound, IF the previous state is neutral.', function () {
      const state = {
        previous: 0,
        wasNeutral: sinon.fake.returns(true),
        isNeutral: sinon.fake.returns(true)
      }
      listener(state)
      expect(state.wasNeutral.calledOnce).to.be.true
      expect(stop.calledOnce).to.be.false
    })

    it('The returned function, when called, should disable the button at position state.previous, IF current state is neutral.', function () {
      const state = {
        previous: 0,
        wasNeutral: () => false,
        isNeutral: sinon.fake.returns(true)
      }
      listener(state)
      expect(state.isNeutral.calledOnce).to.be.true
      expect(disable.calledOnce).to.be.true
    })

    it('The returned function, when called, should disable all buttons at position !== state.current and enable the button at position state.current, IF current state is not neutral.', function () {
      const state = {
        current: 0,
        previous: 0,
        allStates: [0, 1, 2],
        wasNeutral: () => false,
        isNeutral: sinon.fake.returns(false)
      }
      listener(state)
      expect(state.isNeutral.calledOnce).to.be.true
      expect(start.calledOnce).to.be.true
      expect(disable.calledOnce).to.be.true
      expect(enable.calledOnce).to.be.true
    })
  })

  describe("Function 'getSensorListener'.", function () {
    let listener
    let snd
    let event

    beforeEach(function () {
      event = {
        target: { quaternion: [0, 1, 2, 3] }
      }
      snd = {
        setAmp: sinon.fake(),
        setDetune: sinon.fake()
      }
      listener = getSensorListener([snd])
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a function instance.', function () {
      expect(listener).to.be.a('function')
    })

    it("The returned function, when called, should send twice the 'perform' message to each element of the 'sounds' argument.", function () {
      listener(event)
      expect(snd.setDetune.calledOnce).to.be.true
      expect(snd.setAmp.calledOnce).to.be.true
    })
  })

  describe("Function 'getSensorBarListener'.", function () {
    let bar
    let position

    beforeEach(function () {
      bar = {
        offsetWidth: 10
      }
      position = {
        offsetWidth: 0,
        style: { }
      }
    })

    it('Should return a Function instance when called.', function () {
      const listener = getSensorBarListener(bar, position)
      expect(listener).to.be.a('function')
    })

    it("The returned function should set the 'margin-left' CSS property of the '#barPoint' element.", function () {
      const listener = getSensorBarListener(bar, position)
      const event = {
        target: { quaternion: [0, 1, 2, 3] }
      }

      expect(position.style).to.not.have.property('marginLeft')
      listener(event)
      expect(position.style).to.have.property('marginLeft')
    })
  })

  describe("Function 'attachListenerToState'.", function () {
    let state

    beforeEach(function () {
      state = { attachToListeners: sinon.fake() }
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a function instance', function () {
      const func = attachListenerToState()
      expect(func).to.be.a('function')
    })

    it("The returned function, when called, should call the method 'attachListeners' of State, passing the first argument of 'attachListenersToState'.", function () {
      const listener = sinon.fake()
      const func = attachListenerToState(listener, state)
      func({})
      expect(state.attachToListeners.calledOnceWith(listener)).to.be.true
    })
  })

  describe("Function 'addSoundListenerToSensor'.", function () {
    let sensor
    let sound
    let func

    beforeEach(function () {
      sound = { }
      sensor = {
        addEventListener: sinon.fake()
      }
      func = addSoundListenerToSensor([sound], sensor)
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a function instance.', function () {
      expect(func).to.be.a('function')
    })

    it("The returned function when called should call the 'addEventListener' method of Sensor.", function () {
      func()
      expect(sensor.addEventListener.calledOnceWith('reading')).to.be.true
    })
  })

  describe("Function 'addReadingListenerToSensor'.", function () {
    let sensor
    let func
    let listener

    beforeEach(function () {
      listener = () => { }
      sensor = {
        addEventListener: sinon.fake()
      }
      func = addReadingListenerToSensor(listener, sensor)
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a function instance.', function () {
      expect(func).to.be.a('function')
    })

    it("The returned function when called should call the 'addEventListener' method of Sensor passing the second argument of 'addReadingListenerToSensor'.", function () {
      func()
      expect(sensor.addEventListener.calledOnceWith('reading', listener)).to.be.true
    })
  })
})
