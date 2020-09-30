// //////////////////////////////////////////////////
//	Piece for smartphone orchestra
//			by Tassos Tsesmetzis
//
// Main JavaScript file for views/piece.html
// //////////////////////////////////////////////////

// //////////////////////////////////////////////////
// Import statements.
// //////////////////////////////////////////////////
// Import EventDispatcher
import { EventDispatcher } from './eventDispatchers.mjs';
// import functions
import { map, clip, rotateVector, angleBetweenVectors, toggleFullScreen, elementEventListener } from './generalFunctions.mjs';
import { viewUpdaterFunc, buttonListenerFunc, sensorListenerFunc } from './functionsForPiece.mjs';
// Import object 'State'. It models a radio button - check box hybrid.
import State from './state.mjs';
// Import Sound object
import Synth from './synth.mjs';


// //////////////////////////////////////////////////
// Set parameters
// //////////////////////////////////////////////////
// Sound ////////////////////////////////////////
// const audioCtx = new AudioContext();
const baseFreq = 1244.5079348883;	// Eflat 6
const maxAmp = 0.9;
const fadeIn = 1;
const fadeOut = 1;
// Button //////////////////////////////////////
const btnColorOn = 'darkorange';
const btnColorOff = 'darkslategray';
// Toggle full screen
const header = document.getElementsByTagName('header')[0]; // toggle fullscreen when pressed
const main = document.getElementsByTagName('main')[0]; // show this element in fullscreen
// /////////////////////////////////////////////
// Initialize State
const state = new State(0, 1, 2); // New 'State' object with states 0, 1, 2 and neutral state -1
// Collect buttons
const buttons = Array.from(document.getElementsByTagName('button'));

// Extend 'Button' objects and add event listeners
buttons.forEach((btn, i) => {
    Object.assign(btn, {isEnabled: false, index: i});

    btn.enable = function () {
	this.isEnabled = true;

	// Change button color
	this.style.backgroundColor = btnColorOn;
    };

    btn.disable = function () {
	this.isEnabled = false;

	// Change button color
	this.style.backgroundColor = btnColorOff;
    };

    btn.addEventListener('click', buttonListenerFunc(state));
});

// console.log(buttons);

// Initially, the 'button' elements are 'hidden'.
// buttons.forEach(button => button.hidden = true);
// Sensor //////////////////////////////////////
const sensorOptions = {frequency: 60, referenceFrame: 'screen'};
const sensor = new AbsoluteOrientationSensor(sensorOptions);
const screenUpVector = [0, 0, 1];	// This vector will be rotated as the user moves the device.
const deviceHeadVector = [0, 1, 0];	// This vector will be rotated as the user moves the device.
// //////////////////////////////////////////////////

// Toggle full screen when user clicks on title
(() =>  new Promise(resolve => {
    header.addEventListener('click', resolve, {once: true});
})
)()
    .then(event => {
	elementEventListener(toggleFullScreen, main)(event);
	return event;
    })
    // .then(event => {
    // 	// Initially, the 'button' elements are 'hidden'.
    // 	buttons.forEach(button => button.hidden = false);

    // 	return event;
    // })
    .then(event => {
	const audioCtx = new AudioContext();
	const sound = new Synth(baseFreq, fadeIn, fadeOut, audioCtx)

	state.listeners.attach(viewUpdaterFunc(buttons, sound));

	return sound;
    })
    .then(sound => {
	// //////////////////////////////////////////////////
	// from
	// https://w3c.github.io/orientation-sensor/
	// sensor.start();
	sensor.start();

	sensor.addEventListener('error', event => {
	    if (event.error.name === 'SecurityError')
		console.log("No permissions to use AbsoluteOrientationSensor.");
	});

	sensor.addEventListener('reading', sensorListenerFunc(sound, maxAmp, sensorOptions, screenUpVector, deviceHeadVector));

	return sound;
    })
    .catch(console.error);
