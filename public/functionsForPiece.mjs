// //////////////////////////////////////////////////
//	Study for smartphone orchestra
//			by Tassos Tsesmetzis
//
// This files collects several functions specific
// to the piece.
// //////////////////////////////////////////////////
import { map, clip, rotateVector, angleBetweenVectors } from './generalFunctions.mjs';

function viewUpdaterFunc (buttons, sound) {
    let previousState = -1;

    return state => {
	console.log('*** State', state, '\tOldState:', previousState);
	// Stop playing synth if any
	if (previousState > -1) sound.stop(previousState);

	if (state.hasChanged) {
	    const indices = state.all.filter(st => st !== state.current);

	    // Set 'previousState'
	    previousState = state.current;

	    // start new synth
	    sound.play(state.current, (state.current + 1) * sound.baseFreq);

	    // // Stop playing synths if any
	    // const sndIndxs = Object.values(sound.playing)
	    // 	  .filter(snd => indices.includes(snd.oscillator.index))
	    // 	  .map(snd => snd.oscillator.index);

	    console.log('State changed.\tPlaying: ', sound.playing);
	    // sndIndxs.forEach(i => sound.stop(i));

	    // Change color of enabled buttons and disable (if any)
	    const button = buttons.filter(btn => indices.includes(btn.index))
		  .find(btn => btn.isEnabled);

	    if (button) button.disable();

	    // enable new button
	    buttons[state.current].enable();
	} else {
	    // Change color to button
	    buttons[previousState].disable();

	    console.log('State did not change');
	}
    };
}

function buttonListenerFunc (state) {
    return event => {
	state.change(event.target.index);
    };
}

function sensorListenerFunc (sound, maxAmp, sensorOptions, ampVector, detuneVector) {
    const delta = 0.1 / sensorOptions.frequency;

    return event => {
	const amp = maxAmp * Math.pow(
	    map(
		angleBetweenVectors(
		    rotateVector(event.target.quaternion, ampVector),
		    ampVector
		),
		0, Math.PI,
		0, 1
	    ),
	    2
	);

	const detune = map(
	    angleBetweenVectors(
		rotateVector(event.target.quaternion, detuneVector),
		detuneVector
	    ),
	    0, Math.PI,
	    -100, 100
	);

	// console.log(detune);

	for (let synth of sound.playing) {
	    if (synth) {
		sound.detune = detune;
		synth.oscillator.detune.cancelScheduledValues(0.0);
		synth.oscillator.detune.linearRampToValueAtTime(
		    detune,
		    delta
		);

		sound.amp = amp;
		synth.gain.gain.cancelScheduledValues(0.0);
		synth.gain.gain.linearRampToValueAtTime(
		    amp,
		    sound.context.currentTime + delta
		);
	    }
	}
    };
}

export { viewUpdaterFunc, buttonListenerFunc, sensorListenerFunc };