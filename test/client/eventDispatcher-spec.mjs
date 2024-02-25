/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
// Tests for EventDispatcher and OneShotEventDipstacher
// //////////////////////////////////////////////////
import {
  EventDispatcher
} from '../../src/javascript/eventDispatchers.mjs'

import { expect } from 'chai'

describe('EventDispatcher', function () {
  it("Getter 'sender' should return undefined when the object constructor is called with no arguments ", function () {
    const dispatcher = new EventDispatcher()

    expect(dispatcher.sender).to.be.undefined
  })

  it("Getter 'sender' should return the argument that is passed to the object constructor", function () {
    const sender = 10
    const dispatcher = new EventDispatcher(sender)

    expect(dispatcher.sender).to.equal(sender)
  })

  it("Method 'attach' should take function instances as arguments", function () {
    const dispatcher = new EventDispatcher()
    const fn = () => 100

    expect(() => { dispatcher.attach(fn) }).to.not.throw()
    // expect(() => { dispatcher.attach(10) }).to.throw()
  })

  it("Method 'remove' should remove the given listener function from 'listeners'", function () {
    const dispatcher = new EventDispatcher()
    const fn = () => 100

    dispatcher.attach(fn)

    expect(dispatcher.listenerSize()).to.equal(1)

    dispatcher.remove(fn)
    expect(dispatcher.isEmpty()).to.be.true
  })

  it("Getter 'listeners' should return an empty array if no listeners are attached", function () {
    const dispatcher = new EventDispatcher()
    expect(Array.isArray(dispatcher.listeners)).to.be.true
    expect(dispatcher.listeners.length).to.equal(0)
  })

  it("Getter 'listeners' should return an array with the attached listeners", function () {
    const dispatcher = new EventDispatcher()
    const fn1 = (sender, val) => val + 1
    const fn2 = (sender, val) => val * 3

    dispatcher
      .attach(fn1)
      .attach(fn2)

    expect(dispatcher.listeners.length).to.equal(2)
    expect(dispatcher.listeners[0] === fn1).to.be.true
    expect(dispatcher.listeners[1] === fn2).to.be.true
  })

  it("Method 'clear' should empty the array of listeners", function () {
    const dispatcher = new EventDispatcher()
    const fn1 = (sender, val) => val + 1
    const fn2 = (sender, val) => val * 3

    dispatcher
      .attach(fn1)
      .attach(fn2)

    expect(dispatcher.listeners.length).to.equal(2)

    dispatcher.clear()

    expect(dispatcher.listeners.length).to.equal(0)
  })

  it("Method 'isEmpty' should return the correct value", function () {
    const dispatcher = new EventDispatcher()
    const fn1 = (sender, val) => val + 1
    const fn2 = (sender, val) => val * 3

    dispatcher
      .attach(fn1)
      .attach(fn2)

    expect(dispatcher.isEmpty()).to.be.false

    dispatcher.clear()

    expect(dispatcher.isEmpty()).to.be.true
  })

  it("Method 'notify' should call the listeners passing sender as the first argument", function () {
    const sender = 10
    const dispatcher = new EventDispatcher(sender)
    let testVal = 0
    const f1 = x => { testVal = x }

    dispatcher.attach(f1)
    dispatcher.notify()

    expect(testVal).to.equal(10)

    dispatcher.clear()
    testVal = 0

    const f2 = (x, y) => { testVal = x + y }

    dispatcher.attach(f2)
    dispatcher.notify(5)

    expect(testVal).to.equal(15)
  })
})
