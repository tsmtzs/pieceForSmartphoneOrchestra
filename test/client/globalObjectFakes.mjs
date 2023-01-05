// The next line is needed for the chai related assertions
/* eslint-disable no-unused-expressions */
// //////////////////////////////////////////////////
//        Piece For Smartphone Orchestra
//
// //////////////////////////////////////////////////
import sinon from 'sinon'

global.getComputedStyle = sinon.fake()
global.document = {
  querySelector: sinon.fake()
}
