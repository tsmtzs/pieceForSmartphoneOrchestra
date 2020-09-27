// //////////////////////////////////////////////////
//	Piece for smartphone orchestra
//			by Tassos Tsesmetzis
//
// Sound object.
// //////////////////////////////////////////////////
// Object 'Synth' models sound.
export default class Synth {
    constructor (baseFreq, fadeIn, fadeOut, audioCtx) {
	this.baseFreq = baseFreq;
	this.fadeIn = fadeIn;
	this.fadeOut = fadeOut;

	this.context = audioCtx;
	this.playing = [];	// stores playing synths
    }

    play (index, freq) {
	const oscillator = this.context.createOscillator();
	const gain = this.context.createGain();
	const fadeIn = this.context.createGain();

	// console.log(gain);

	oscillator.type = 'sine';
	oscillator.frequency.value = freq;
	oscillator.detune.value = this.detune ? this.detune : 0;
	// add a new property 'index'
	oscillator.index = index;

	gain.gain.value = 0.0;

	fadeIn.gain.setValueAtTime(0, this.context.currentTime);
	fadeIn.gain.linearRampToValueAtTime(1, this.context.currentTime + this.fadeIn);

	oscillator.connect(gain);
	gain.connect(fadeIn);
	fadeIn.connect(this.context.destination);

	oscillator.start(this.context.currentTime);

	this.putAtPlaying(index, {gain: gain, oscillator: oscillator});
    }

    stop (index) {
	const current = this.playing[index];
	// this.playing[index] = undefined;

	if (current) {
	    current.gain.gain.cancelScheduledValues(0);
	    current.gain.gain.linearRampToValueAtTime(0.0, this.context.currentTime + this.fadeOut);
	    current.oscillator.stop(this.context.currentTime + this.fadeOut + 0.001);
	    // console.log(this.playing, index);
	}
    }

    putAtPlaying (index, object) {
	this.stop(index);
	this.playing[index] = object;
	object.oscillator.addEventListener('ended', this.nodeListener);
    }
}
