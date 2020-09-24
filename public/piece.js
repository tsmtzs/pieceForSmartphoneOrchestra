// //////////////////////////////////////////////////
//	Piece for smartphone orchestra
//			by Tassos Tsesmetzis
//
// Main JavaScript file.
// //////////////////////////////////////////////////

// //////////////////////////////////////////////////
// Import statements.
// //////////////////////////////////////////////////
// Import EventDispatcher
import EventDispatcher from './eventDispatcher.mjs';
// import functions
import { map, clip, rotateVector, angleBetweenVectors, toggleFullScreen, titleEventListener } from './generalFunctions.mjs';
import { viewUpdaterFunc, audioNodeListenerFunc, buttonListenerFunc, sensorListenerFunc } from './functionsPieceA.mjs';
// Import object 'State'. It models a radio button - check box hybrid.
import State from './state.mjs';
// Import Sound object
import SynthA from './synthA.mjs';


// //////////////////////////////////////////////////
// Set parameters
// //////////////////////////////////////////////////
// Sound ////////////////////////////////////////
const audioCtx = new AudioContext();
const baseFreq = 1244.5079348883;	// Eflat 6
const maxAmp = 0.6;
const fadeIn = 1;
const fadeOut = 1;
// Button //////////////////////////////////////
const btnColorOn = 'darkorange';
const btnColorOff = 'darkslategray';
// Toggle full screen
const title = document.getElementsByTagName('h1')[0]; // toggle fullscreen when pressed
const main = document.getElementsByTagName('main')[0]; // show this element in fullscreen
// /////////////////////////////////////////////
const state = new State(0, 1, 2); // New 'State' object with states 0, 1, 2 and neutral state -1
const buttons = Array.from(document.getElementsByTagName('button'));

//
const sound = new SynthA(baseFreq, fadeIn, fadeOut, audioCtx)
// Sensor //////////////////////////////////////
const sensorOptions = {frequency: 60, referenceFrame: 'screen'};
const sensor = new AbsoluteOrientationSensor(sensorOptions);
const screenUpVector = [0, 0, 1];	// This vector will be rotated as the user moves the device.
const deviceHeadVector = [0, 1, 0];	// This vector will be rotated as the user moves the device.

// //////////////////////////////////////////////////
// from
// https://w3c.github.io/orientation-sensor/
sensor.start();

sensor.addEventListener('error', event => {
    if (event.error.name === 'SecurityError')
	console.log("No permissions to use AbsoluteOrientationSensor.");
});

sensor.addEventListener('reading', sensorListenerFunc(sound, maxAmp, sensorOptions, screenUpVector, deviceHeadVector));

// console.log(sensor);

sound.nodeListener = audioNodeListenerFunc(sound);

state.listeners.attach(viewUpdaterFunc(buttons, sound));

// Toggle full screen when user touches the title
title.addEventListener('click', titleEventListener(toggleFullScreen, main));

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
