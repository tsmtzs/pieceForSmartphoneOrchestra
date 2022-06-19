/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
//        Piece For Smartphone Orchestra
//
// Tests for State.
// //////////////////////////////////////////////////
import {
  State
} from '../../src/javascript/state.mjs'

import pkg from 'chai'
const { expect } = pkg

describe('State', function () {
  let states
  let state

  beforeEach(function () {
    states = [5, 6, 7]
    state = new State(...states)
  })

  it('Constructor should throw when the neutral state is given as an argument.', function () {
    expect(() => { new State(State.NEUTRAL, 0, 1) }).to.throw()
  })

  it("Method 'changeTo' should throw an Error when argument is not a valid state.", function () {
    expect(state.changeTo.bind(state)).to.throw()
    expect(() => { state.changeTo(300) }).to.throw()
    expect(() => { state.changeTo(-1) }).to.throw()
  })

  it("Getter method 'allStates' should return an Array instance with elements the elements of the property 'allStates'.", function () {
    const statesArray = state.allStates

    expect(statesArray instanceof Array).to.be.true
    expect(statesArray.length).to.equal(states.length)
    expect(statesArray.every(elem => states.includes(elem))).to.be.true
    expect(states.every(elem => statesArray.includes(elem))).to.be.true
  })

  it("Getter 'current' should return the neutral state when state is not set.", function () {
    expect(state.current).to.equal(State.NEUTRAL)

    state.changeTo(5)
    state.changeTo(5)
    expect(state.current).to.equal(State.NEUTRAL)
  })

  it("Getter 'current' should return the current state.", function () {
    state.changeTo(5)
    expect(state.current).to.equal(5)

    state.changeTo(5)
    expect(state.current).to.equal(State.NEUTRAL)
  })

  it("Getter 'previous' should return the neutral state when the previous state upon initialization.", function () {
    expect(state.previous).to.equal(State.NEUTRAL)
  })

  it("Getter 'previous' should return the neutral state after three consecutive messages of 'changeTo' with the same argument.", function () {
    state.changeTo(5)
    state.changeTo(5)
    state.changeTo(5)
    expect(state.previous).to.equal(State.NEUTRAL)
  })

  it("Getter 'previous' should return the previous state after two calls to 'changeTo' with different arguments.", function () {
    state.changeTo(5)
    expect(state.previous).to.equal(State.NEUTRAL)

    state.changeTo(6)
    expect(state.previous).to.equal(5)
  })

  it("Method 'isNeutral' should return true if current equals the neutral state, and false otherwise.", function () {
    expect(state.isNeutral()).to.be.true

    state.changeTo(5)
    expect(state.isNeutral()).to.be.false

    state.changeTo(5)
    expect(state.isNeutral()).to.be.true
  })
})
