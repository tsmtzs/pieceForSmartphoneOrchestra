/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
//        Piece For Smartphone Orchestra
//
// Tests for module functionsForPiece.mjs.
// //////////////////////////////////////////////////
import {
  getButtonListener,
  extendBtns,
  getViewUpdater,
  getSensorListener,
  getSensorBarListener,
  setBackgroundColorAndBorderToButtons,
  attachListenerToState,
  addSoundListenerToSensor,
  addReadingListenerToSensor
} from '../../src/javascript/functions.mjs'

import sinon from 'sinon'

import pkg from 'chai'
const { expect } = pkg

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
      expect(listener.constructor).to.equal(Function)
    })

    it("The returned function, when called,  should send the message 'changeTo' to function's argument.", function () {
      listener(event)
      expect(state.changeTo.callCount).to.equal(1)
    })
  })

  describe("Function 'extendBtns'.", function () {
    let button
    let state

    beforeEach(function () {
      button = {
        style: { },
        addEventListener: sinon.fake()
      }
      state = { }
    })

    afterEach(() => {
      sinon.restore()
    })

    it("Should add the property 'isEnabled' to each button of the 'buttons' argument.", function () {
      expect(button.isEnabled).to.be.undefined

      extendBtns([button], state)
      expect(button.isEnabled).to.be.false
    })

    it("Should add the property 'index' to each button of the 'buttons' argument.", function () {
      expect(button.index).to.be.undefined

      extendBtns([button], state)
      expect(button.index).to.equal(0)
    })

    it("Should add the methods 'enable' and 'disable' to each button of the 'buttons' argument.", function () {
      expect(button.enable).to.be.undefined
      expect(button.disable).to.be.undefined

      extendBtns([button], state)
      expect(button.enable.constructor).to.equal(Function)
      expect(button.disable.constructor).to.equal(Function)
    })

    it("Should call 'addEventListener' to each button of the 'buttons' argument.", function () {
      extendBtns([button], state)
      expect(button.addEventListener.callCount).to.equal(1)
      expect(button.addEventListener.firstArg).to.equal('pointerdown')
      expect(button.addEventListener.lastArg.constructor).to.equal(Function)
    })
  })

  describe("Function 'getViewUpdater'.", function () {
    afterEach(() => {
      sinon.restore()
    })

    it('Should return a Function instance.', function () {
      const listener = getViewUpdater()

      expect(listener instanceof Function).to.be.true
    })

    it('The returned function, when called, should stop the sound at index state.previous, IF previous state is not neutral.', function () {
      const sound = {
        stop: sinon.fake()
      }
      const state = {
        previous: 0,
        wasNeutral: sinon.fake.returns(false),
        isNeutral: sinon.fake.returns(true)
      }
      const btn = { }
      const listener = getViewUpdater([btn], sound)
      listener(state)
      expect(state.wasNeutral.callCount).to.equal(1)
      expect(sound.stop.callCount).to.equal(1)
      expect(sound.stop.firstArg).to.equal(state.previous)
    })

    it('The returned function, when called, should NOT stop any sound, IF previous state is neutral.', function () {
      const sound = {
        stop: sinon.fake()
      }
      const state = {
        previous: 0,
        wasNeutral: sinon.fake.returns(true),
        isNeutral: sinon.fake.returns(true)
      }
      const btn = { }
      const listener = getViewUpdater([btn], sound)
      listener(state)
      expect(state.wasNeutral.callCount).to.equal(1)
      expect(sound.stop.callCount).to.equal(0)
    })

    it('The returned function, when called, should disable the button at position state.previous, IF current state is neutral.', function () {
      const sound = {
        stop: () => { }
      }
      const state = {
        previous: 0,
        wasNeutral: () => false,
        isNeutral: sinon.fake.returns(true)
      }
      const btn = {
        disable: sinon.fake()
      }
      const listener = getViewUpdater([btn], sound)
      listener(state)
      expect(state.isNeutral.callCount).to.equal(1)
      expect(btn.disable.callCount).to.equal(1)
    })

    it('The returned function, when called, should disable all buttons at position !== state.current and enable the button at position state.current, IF current state is not neutral.', function () {
      const sound = {
        stop: () => { },
        start: sinon.fake()
      }
      const state = {
        current: 0,
        previous: 0,
        allStates: [0, 1, 2],
        wasNeutral: () => false,
        isNeutral: sinon.fake.returns(false)
      }
      const disable = sinon.fake()
      const enable = sinon.fake()
      const btn1 = {
        enable,
        disable,
        isEnabled: true,
        index: 0
      }
      const btn2 = {
        enable,
        disable,
        isEnabled: true,
        index: 1
      }
      const btn3 = {
        enable,
        disable,
        isEnabled: false,
        index: 2
      }
      const listener = getViewUpdater([btn1, btn2, btn3], sound)
      listener(state)
      expect(state.isNeutral.callCount).to.equal(1)
      expect(sound.start.callCount).to.equal(1)
      expect(disable.callCount).to.equal(1)
      expect(enable.callCount).to.equal(1)
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
        perform: sinon.spy()
      }
      listener = getSensorListener([snd])
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a function instance.', function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The returned function, when called, should send twice the 'perform' message to each element of the 'sounds' argument.", function () {
      listener(event)
      expect(snd.perform.callCount).to.equal(2)
      expect(snd.perform.withArgs('setDetune').calledOnce).to.be.true
      expect(snd.perform.withArgs('setAmp').calledOnce).to.be.true
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

    it('Should return a Function instance when called, with argument document', function () {
      const listener = getSensorBarListener(bar, position)
      expect(listener instanceof Function).to.be.true
    })

    it("The returned function should set the 'margin-left' CSS property of the '#barPoint' element.", function () {
      const listener = getSensorBarListener(bar, position)
      const event = {
        target: { quaternion: [0, 1, 2, 3] }
      }

      expect(position.style.margiLeft).to.be.undefined
      listener(event)
      expect(position.style.marginLeft).to.not.be.undefined
    })
  })

  describe("Function 'setBackgroundColorAndBorderToButtons'.", function () {
    let btn
    let listener

    beforeEach(function () {
      btn = {
        style: { }
      }
      listener = setBackgroundColorAndBorderToButtons([btn])
    })

    it('Should return a Function instance.', function () {
      expect(listener instanceof Function).to.be.true
    })

    it("The returned function, when called, should set the CSS properties 'backgroundColor' and 'border'.", function () {
      expect(btn.style.backgroundColor).to.be.undefined
      expect(btn.style.border).to.be.undefined

      listener()
      expect(btn.style.backgroundColor).to.not.be.undefined
      expect(btn.style.border).to.not.be.undefined
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
      expect(func instanceof Function).to.be.true
    })

    it("The returned function, when called, should call the method 'attachListeners' of State, passing the first argument of 'attachListenersToState'.", function () {
      const listener = sinon.fake()
      const func = attachListenerToState(listener, state)
      func({})
      expect(state.attachToListeners.calledOnce).to.be.true
      expect(state.attachToListeners.firstArg).to.equal(listener)
    })
  })

  describe("Function 'addSoundListenerToSensor'.", function () {
    let sensor
    let func

    beforeEach(function () {
      sensor = {
        addEventListener: sinon.fake()
      }
      func = addSoundListenerToSensor(sensor)
    })

    afterEach(function () {
      sinon.restore()
    })

    it('Should return a function instance.', function () {
      expect(func instanceof Function).to.be.true
    })

    it("The returned function when called should call the 'addEventListener' method of Sensor.", function () {
      func()
      expect(sensor.addEventListener.calledOnce).to.be.true
      expect(sensor.addEventListener.firstArg).to.equal('reading')
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
      expect(func instanceof Function).to.be.true
    })

    it("The returned function when called should call the 'addEventListener' method of Sensor passing the second argument of 'addReadingListenerToSensor'.", function () {
      func()
      expect(sensor.addEventListener.calledOnce).to.be.true
      expect(sensor.addEventListener.firstArg).to.equal('reading')
      expect(sensor.addEventListener.lastArg).to.equal(listener)
    })
  })
})
