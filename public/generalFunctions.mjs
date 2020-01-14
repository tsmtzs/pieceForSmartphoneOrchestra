// //////////////////////////////////////////////////
// Several functions for
//	Study for smartphone orchestra
//			by Tassos Tsesmetzis
// //////////////////////////////////////////////////

// linear mapping [a, b] -> [c, d].
function map (x, a = 0, b = 1, c = 0, d = 1) {
    let dif = a - b;

    return ((c - d ) * x + a * d - b * c) / dif;
}

// x => max(a, min(b, x))
function clip (x, a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);

    return Math.max(min, Math.min(max, x));
}

// Function 'rotateVector' adapted from the
// JavaScript library 'Quaternion.js'
// https://github.com/infusion/Quaternion.js
// 
/**
 * Rotates a vector according to the current quaternion
 *
 * @param {Array} v The vector to be rotated
 * @returns {Array}
 */
function rotateVector (quaternion, v) {

    // [0, v'] = Q * [0, v] * Q'

    // Q
    var w1 = quaternion[3];
    var x1 = quaternion[0];
    var y1 = quaternion[1];
    var z1 = quaternion[2];

    // [0, v]
    var w2 = 0;
    var x2 = v[0];
    var y2 = v[1];
    var z2 = v[2];

    // Q * [0, v]
    var w3 = /*w1 * w2*/ -x1 * x2 - y1 * y2 - z1 * z2;
    var x3 = w1 * x2 + /*x1 * w2 +*/ y1 * z2 - z1 * y2;
    var y3 = w1 * y2 + /*y1 * w2 +*/ z1 * x2 - x1 * z2;
    var z3 = w1 * z2 + /*z1 * w2 +*/ x1 * y2 - y1 * x2;

    var w4 = w3 * w1 + x3 * x1 + y3 * y1 + z3 * z1;
    var x4 = x3 * w1 - w3 * x1 - y3 * z1 + z3 * y1;
    var y4 = y3 * w1 - w3 * y1 - z3 * x1 + x3 * z1;
    var z4 = z3 * w1 - w3 * z1 - x3 * y1 + y3 * x1;

    return [x4, y4, z4];
}

// 3D vector related functions
// vec: An Array of length 3
function vectorLength (vec) {
    return Math.hypot(...vec);
}

function vectorDotProduct (v1, v2) {
    return v1.map((elem, i) => elem * v2[i])
	.reduce(
	    (accumulator, currentVal) => accumulator + currentVal,
	    0
	);
}

function angleBetweenVectors (v1, v2) {
    return Math.acos(vectorDotProduct(v1, v2) / (vectorLength(v1) * vectorLength(v2)));
}

// Enable full screen mode
// adapted from
//https://developer.mozilla.org/samples/domref/fullscreen.html
function toggleFullScreen(elem) {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
	if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
	} else {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
    } else {
	if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
	} else {
            document.webkitCancelFullScreen();
	}
    }
}

// 'h1' element event listener. Change to full screen.
function titleEventListener (toggleFullScreen, elem) {
    return (event) => toggleFullScreen(elem);
}

export {map, clip, rotateVector};
export {vectorLength, vectorDotProduct, angleBetweenVectors};
export {toggleFullScreen, titleEventListener};
