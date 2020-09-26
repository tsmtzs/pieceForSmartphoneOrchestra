// //////////////////////////////////////////////////
//	Study for smartphone orchestra
//			by Tassos Tsesmetzis
//
// This files collects several functions specific
// to the piece.
// //////////////////////////////////////////////////
import { map, clip, rotateVector, angleBetweenVectors } from './generalFunctions.mjs';

function viewUpdaterFunc (buttons, sound) {
    return (state, oldState) => {
	if (state.hasChanged) {
	    const indices = state.all.filter(st => st !== state.current);

	    // Stop playing synths if any
	    const sndIndxs = Object.values(sound.playing)
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
	    // Stop playing synth if any
	    sound.stop(oldState);

	    // Change color to button
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
	const amp = Math.pow( map(
	    angleBetweenVectors(
		rotateVector(event.target.quaternion, ampVector),
		ampVector
	    ),
	    0, Math.PI,
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

export { viewUpdaterFunc, audioNodeListenerFunc, buttonListenerFunc, sensorListenerFunc };
