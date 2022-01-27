/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for smartphone orchestra
//      by Tassos Tsesmetzis
//
// General purpose functions.
// //////////////////////////////////////////////////

// Enable full screen mode
// adapted from
// https://developer.mozilla.org/samples/domref/fullscreen.html
function toggleFullScreen (elem) {
  if (!document.mozFullScreen && !document.webkitFullScreen) {
    if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else {
      elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  } else {
    if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else {
      document.webkitCancelFullScreen()
    }
  }
}

// Element event listener. Change to full screen.
function elementEventListener (toggleFullScreen, elem) {
  return event => toggleFullScreen(elem)
}

export {
  toggleFullScreen,
  elementEventListener
}
