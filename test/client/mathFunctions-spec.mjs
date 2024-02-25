/* eslint-env mocha */
// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
//        Piece For Smartphone Orchestra
//
// Tests for State.
// //////////////////////////////////////////////////
import {
  map,
  clip,
  vectorLength,
  vectorDotProduct,
  angleBetweenVectors
} from '../../src/javascript/mathFunctions.mjs'

import { expect } from 'chai'

describe('Math functions.', function () {
  describe('map: Linear mapping [a, b] -> [c, d]', function () {
    it('Should throw an Error when a === b.', function () {
      const a = 1
      const b = a
      const c = 2
      const d = 3

      expect(() => { map(1, a, b, c, d) }).to.throw()
    })

    it("Argument 'a' should map to 'c' and argument 'b' to 'd'.", function () {
      const a = 0
      const b = 1
      const c = 2
      const d = 3
      const mapUnitInterval = x => map(x, a, b, c, d)

      expect(mapUnitInterval(a)).to.equal(c)
      expect(mapUnitInterval(b)).to.equal(d)
    })

    it('For each x<-[a, b]  (map(x) - map(a)) / (x - a) should equal (map(b) - map(a)) / (b - a)', function () {
      const a = 0
      const b = 1
      const c = 2
      const d = 3
      const mapInterval = x => map(x, a, b, c, d)
      const slope = (mapInterval(b) - mapInterval(a)) / (b - a)
      const testPoints = 100
      const array = [...Array(testPoints).keys()]
        .map(() => {
          const x = a + (b - a) * Math.random()
          const innerPointSlope = (mapInterval(x) - mapInterval(a)) / (x - a)

          return [x, Math.abs(innerPointSlope - slope)]
        })
        .filter(pair => pair[1] > 1e-12)

      expect(array).to.be.empty
    })
  })

  describe('clip: x => max(a, min(b, x)), a < b', function () {
    it('When a === b, should return a, for each x.', function () {
      const a = 1
      const b = a
      const testPoints = 10
      const clipInterval = x => clip(x, a, b)
      const array = [...Array(testPoints).keys()]
        .map(() => {
          const x = Math.random() * 10

          return [x, clipInterval(x)]
        })
        .filter(pair => pair[1] !== a)

      expect(array).to.be.empty
    })

    it('Should return a, when x < a', function () {
      const a = 1
      const b = 2
      const clipInterval = x => clip(x, a, b)
      const x = -1

      expect(clipInterval(x)).to.equal(a)
    })

    it('Should return b, when x > b', function () {
      const a = 1
      const b = 2
      const clipInterval = x => clip(x, a, b)
      const x = 3

      expect(clipInterval(x)).to.equal(b)
    })

    it('Should return x, when a <= x <= b', function () {
      const a = 1
      const b = 2
      const clipInterval = x => clip(x, a, b)
      const x = 1.3

      expect(clipInterval(x)).to.equal(x)
    })
  })

  describe('vectorLength: Euclidean length of an n-dimensional vector.', function () {
    it('Should return the magnitude of the all 1s vector.', function () {
      const n = 10
      const vector = [...Array(n).keys()].fill(1)
      expect(vectorLength(vector)).to.equal(Math.sqrt(n))
    })
  })

  describe('vectorDotProduct: Dot product of two vectors.', function () {
    it('Should return 0 for perpendicular vectors.', function () {
      const theta = Math.random() * Math.PI
      const vector1 = [Math.cos(theta), Math.sin(theta)]
      const vector2 = [Math.sin(theta), -Math.cos(theta)]
      expect(vectorDotProduct(vector1, vector2)).to.equal(0.0)
    })
  })

  describe('angleBetweenVectors: Angle in radias between n-dimensional vectors.', function () {
    it('Should throw an Error when one of the argument vectors is the zero vector.', function () {
      const n = 10
      const keys = [...Array(n).keys()]
      const zero = keys.fill(0)
      const vector = keys.map(() => Math.random())

      expect(() => angleBetweenVectors(zero, vector)).to.throw()
      expect(() => angleBetweenVectors(vector, zero)).to.throw()
      expect(() => angleBetweenVectors(zero, zero)).to.throw()
    })

    it('Should return PI / 2 for perpendicular vectors.', function () {
      const theta = Math.random() * Math.PI
      const vector1 = [Math.cos(theta), Math.sin(theta)]
      const vector2 = [Math.sin(theta), -Math.cos(theta)]
      expect(angleBetweenVectors(vector1, vector2)).to.equal(Math.PI / 2)
    })
  })
})
