// //////////////////////////////////////////////////
// Sound object for
//	Study for smartphone orchestra
//		Piece A
//			by Tassos Tsesmetzis
// //////////////////////////////////////////////////

// Object 'SynthA' models sound.
function SynthA (baseFreq, fadeIn, fadeOut, audioCtx) {
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

SynthA.prototype.play = function (index, freq) {
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const fadeIn = this.context.createGain();

    // console.log(gain);

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    oscillator.detune.value = this.detune ? this.detune : 0;
    // add a new property 'index'
    oscillator.index = index;

    // gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.value = 0;

    fadeIn.gain.setValueAtTime(0, this.context.currentTime);
    fadeIn.gain.linearRampToValueAtTime(1, this.context.currentTime + this.fadeIn);

    oscillator.connect(gain);
    gain.connect(fadeIn);
    fadeIn.connect(this.context.destination);

    oscillator.start(this.context.currentTime);

    // this.playing[index] = {gain: gain, oscillator: oscillator};
    this.putAtPlaying(index, {gain: gain, oscillator: oscillator});
}

SynthA.prototype.stop = function (index) {
    const current = this.playing[index];
    
    this.playing[index] = undefined;    

    current.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.fadeOut);
    current.oscillator.stop(this.context.currentTime + this.fadeOut);
    // console.log(this.playing, index);
}

SynthA.prototype.putAtPlaying = function (index, object) {
    this.playing[index] = object;
    object.oscillator.addEventListener('ended', this.nodeListener);
}

export default SynthA
