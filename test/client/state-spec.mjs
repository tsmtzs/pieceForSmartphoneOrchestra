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
    states = [0, 1, 2]
    state = new State(...states)
  })

  it("Method 'changeTo' should throw an Error when argument is not a valid state.", function () {
    expect(state.changeTo.bind(state)).to.throw()
    expect(() => { state.changeTo(300) }).to.throw()
    expect(() => { state.changeTo(-1) }).to.throw()
  })

  it("Getter 'changed' should be false when property 'current' is '-1', and true when 'current' holds a member of 'all'.", function () {
    expect(state.changed).to.be.false

    state.changeTo(1)
    expect(state.changed).to.be.true

    state.changeTo(1)
    expect(state.changed).to.be.false
  })
})
