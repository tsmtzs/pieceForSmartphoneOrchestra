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
  extendBtns
} from '../../src/javascript/functionsForPiece.mjs'

import pkg from 'chai'
const { expect } = pkg

import sinon from 'sinon'

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
})
