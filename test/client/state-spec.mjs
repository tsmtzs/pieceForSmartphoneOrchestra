/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
//        Human Sound Sculpture
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

  before(function () {
    states = [5, 6, 7]
    state = new State(...states)
  })

  it("Method 'changeTo' should throw an Error when argument is not a valid state.", function () {
    expect(state.changeTo.bind(state)).to.throw()
    expect(() => { state.changeTo(300) }).to.throw()
    expect(() => { state.changeTo(-1) }).to.throw()
  })

  it("Getter 'changed' should be false when property 'current' is '-1', and true when 'current' holds a member of 'all'.", function () {
    expect(state.changed).to.be.false

    state.changeTo(5)
    expect(state.changed).to.be.true

    state.changeTo(5)
    expect(state.changed).to.be.false
  })

  it("Getter method 'allStates' should return an Array instance with elements the elements of the property 'allStates'.", function () {
    const statesArray = state.allStates

    expect(statesArray instanceof Array).to.be.true
    expect(statesArray.length).to.equal(states.length)
    expect(statesArray.every(elem => states.includes(elem))).to.be.true
    expect(states.every(elem => statesArray.includes(elem))).to.be.true
  })
})
