// //////////////////////////////////////////////////
// Objects
// //////////////////////////////////////////////////

// 'State' object models a hybrid of check boxes and radio buttons.
// Upon initialization you give a number of valid states (aka check boxes - radio buttons).
// State '-1'  is neutral (no button is pressed).
// The method 'change' changes state (presses - deselect a button).
// When argument is different than current state, pass it to current state (press radio button).
// When argument is the same as current state, change state to neutral (deselect a button)
function State () {
    this.current = -1;
    this.all = Array.from(arguments);
    this.hasChanged = false;
    this.listeners = new EventDispatcher(this);
}

State.prototype.change = function (anInteger) {
    let newState;

    if (this.all.includes(anInteger)) {
	this.current = this.current === anInteger ? (this.hasChanged = false, -1) : (this.hasChanged = true, anInteger);

	this.listeners.notify(anInteger);
    } else {
	throw new Error('Argument is not a valid state.');

    }
}

// Object 'Synth' models sound.
function Sound (baseFreq, fadeIn, fadeOut, audioCtx) {
    this.baseFreq = baseFreq;
    // this.amp = amp;
    // this.detune = detune;
    this.fadeIn = fadeIn;
    this.fadeOut = fadeOut;

    this.context = audioCtx;
    // this.gainNode = audioCtx.createGain();
    // this.detuneNode = audioCtx.createGain();
    this.playing = {};	// stores playing synths
}

Sound.prototype.play = function (index, freq) {
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    // console.log(gain);

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    oscillator.detune.value = this.detune ? this.detune : 0;
    // add a new property 'index'
    oscillator.index = index;

    gain.gain.setValueAtTime(0, this.context.currentTime);
    // gain.gain.linearRampToValueAtTime(this.amp ? this.amp : 0, this.context.currentTime + this.fadeIn);

    oscillator.connect(gain);
    gain.connect(this.context.destination);

    oscillator.start(this.context.currentTime);

    // this.playing[index] = {gain: gain, oscillator: oscillator};
    this.putAtPlaying(index, {gain: gain, oscillator: oscillator});
}

Sound.prototype.stop = function (index) {
    const current = this.playing[index];
    
    this.playing[index] = undefined;    

    current.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.fadeOut);
    current.oscillator.stop(this.context.currentTime + this.fadeOut);
    // console.log(this.playing, index);
}

Sound.prototype.putAtPlaying = function (index, object) {
    this.playing[index] = object;
    object.oscillator.addEventListener('ended', this.nodeListener);
}

// //////////////////////////////////////////////////
// Functions
// //////////////////////////////////////////////////
function viewUpdaterFunc (buttons, sound) {
    return (state, oldState) => {
	if (state.hasChanged) {
	    const indices = state.all.filter(st => st !== state.current);

	    // Stop playing synths if any
	    const sndIndxs = Object.values(sound.playing)
		  .filter(snd => snd)
		  .filter(snd => indices.includes(snd.oscillator.index))
		  .map(snd => snd.oscillator.index);

	    // console.log('Indices: ', sndIndxs);
	    sndIndxs.forEach(i => sound.stop(i));

	    // start new synth
	    sound.play(state.current, (state.current + 1) * sound.baseFreq);

	    // Change color of enabled buttons and disable (if any)
	    const button = buttons.filter(btn => indices.includes(btn.index))
		  .find(btn => btn.isEnabled);

	    if (button) button.disable();
	    
	    // enable new button
	    buttons[state.current].enable();
	} else {
	    // close playing synth if any
	    sound.stop(oldState);

	    // change color to button if any
	    buttons[oldState].disable();
	}
    };
}

function audioNodeListenerFunc (sound) {
    return (event) => {
	sound.playing[event.target.index] = undefined;
    };
}

function buttonListenerFunc (state) {
    return (event) => {
	// console.log(event);
	state.change(event.target.index);
    };
}

function sensorListenerFunc (sound, maxAmp, sensorOptions, ampVector, detuneVector) {
    const delta = 1 / sensorOptions.frequency;

    return (event) => {
	// const amp = map(clip(event.target.quaternion[1], -0.8, 0.8), -0.8, 0.8, 0, 0.2);
	// const detune = map(clip(event.target.quaternion[0], -0.8, 0.8), -0.8, 0.8, -100, 100);

	const amp = Math.pow( map(
	    angleBetweenVectors(
		rotateVector(event.target.quaternion, ampVector),
		ampVector
	    ),
	    0, Math.PI, 	// 
	    0, maxAmp
	),
			      2);

	const detune = map(
	    angleBetweenVectors(
	    rotateVector(event.target.quaternion, detuneVector),
	    detuneVector
	    ),
	    0, Math.PI,
	    100, -100
	);

	// console.log(detune);

	for (let synth of Object.values(sound.playing)) {
	    if (synth) {
		sound.detune = detune;
		synth.oscillator.detune.linearRampToValueAtTime(
		    detune,
		    delta
		);

		sound.amp = amp;
		synth.gain.gain.linearRampToValueAtTime(
		    amp,
		    delta
		);
	    }
	}
    };
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
// //////////////////////////////////////////////////
//
// //////////////////////////////////////////////////
// Import EventDispatcher
import EventDispatcher from './eventDispatcher.mjs';
// import functions
import {map, clip, rotateVector, angleBetweenVectors} from './functions.mjs';
// Sound ////////////////////////////////////////
const audioCtx = new AudioContext();
const baseFreq = 932.33;	// B4b
// const detune = 0;
const maxAmp = 0.3;
const fadeIn = 0.5;
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
const sound = new Sound(baseFreq, fadeIn, fadeOut, audioCtx)
// Sensor //////////////////////////////////////
const sensorOptions = {frequency: 60, referenceFrame: 'screen'};
const sensor = new AbsoluteOrientationSensor(sensorOptions);
const screenUpVector = [0, 0, 1];	// This vector will be rotated as the user moves the device.
const deviceHeadVector = [0, 1, 0];	// This vector will be rotated as the user moves the device.

// from
// https://w3c.github.io/orientation-sensor/
sensor.start();

sensor.addEventListener('error', event => {
    if (event.error.name === 'SecurityError')
	console.log("No permissions to use AbsoluteOrientationSensor.");
});

sensor.addEventListener('reading', sensorListenerFunc(sound, maxAmp, sensorOptions, screenUpVector, deviceHeadVector));

console.log(sensor);

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

console.log(buttons);
