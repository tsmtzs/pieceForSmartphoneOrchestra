// ==================================================
// Frequency calculations
// ==================================================
// Given two frequencies f1 and f2, the next code
// caclulates the quadratic difference tone f2 - f1
// and the cubic difference tone 2*f2 - f1.
(
var f1 = 86.midicps;
var f2 = f1 * 2.midiratio;
var ratio = f2 / f1;
var qdt = f2 - f1;
var cdt = 2 * f1 - f2;

"\nf1 = %\tf2 = %\tf2/f1 = %\tQDT = f2 - f1 = %\tCDT = 2f1 - f2 = %".format(f1, f2, ratio, qdt, cdt);
)

// ==================================================
// Sound tests
// ==================================================
(
~sine = {|freq = 200, amp = 0.01, attack = 2, release = 4, gate = 1.0, pan = 0.0, detune = 0.0|
	var sig, env;

	sig = SinOsc.ar(freq + detune, 0, amp);
	env = EnvGen.kr(Env.asr(attack, 1, release), gate, doneAction: Done.freeSelf);

	Pan2.ar(sig * env, pan);
})

// For two given sinusoids with
// frequencies f1, f2, otoacoustic emission effects can be more
// easily perceived when frequency ratio is close to 1.3 and
// amplitude is relatively high [1].
// Frequencies for "Piece for Smartphone Orchestra" center around
// Eflat6, Eflat7 and Eflat8. The closest ratio to 1.3
// that might occur during a performance is 1.22. This can happen
// when two frequencies
// deviate from the center Eflat for 1 semitone in opposite directions.
Ndef(\baseFreq, { 87.midicps })
Ndef(\f1, { Ndef(\baseFreq) * 1.midiratio })
Ndef(\f2, { Ndef(\baseFreq) * 1.neg.midiratio })
Ndef(\cdt, { 2 * Ndef(\f2) - Ndef(\f1) })
Ndef(\qdt, { Ndef(\f2) - Ndef(\f1) })

Ndef(\sine1, ~sine)
Ndef(\sine1).map(\freq, Ndef(\f1))
Ndef(\sine1).set(\amp, 0.01).play
Ndef(\sine1).stop(0.1)
Ndef(\sine1).play
Ndef(\sine1).clear

Ndef(\sine2, ~sine)
Ndef(\sine2).map(\freq, Ndef(\f2))
Ndef(\sine2).set(\amp, 0.01).play
Ndef(\sine2).stop(0.1)
Ndef(\sine2).play
Ndef(\sine2).clear

Ndef(\cdtSine, ~sine)
Ndef(\cdtSine).map(\freq, Ndef(\cdt))
Ndef(\cdtSine, ~sine).set(\pan, 0.8, \amp, 0.005).play
Ndef(\cdtSine).set(\amp, 0.0)
// If the cubic difference tone is not distinguishable,
// try to detune the frequency for 1-3 Hz.
// Beats will occur.
Ndef(\cdtSine).set(\detune, 0)
Ndef(\cdtSine).clear(1)

Ndef(\qdtSine, ~sine)
Ndef(\qdtSine).map(\freq, Ndef(\qdt))
Ndef(\qdtSine).set(\pan, -0.8, \amp, 0.008).play
Ndef(\qdtSine).set(\amp, 0.0)
Ndef(\qdtSine).set(\detune, 0)
Ndef(\qdtSine).clear(1)

Ndef.clear
// ==================================================
// Reference
// ==================================================
// [1] Kendall GS, Haworth C, Cádiz RF. "Sound Synthesis with Auditory Distortion Products". Computer Music Journal 38, 4 (2014):5–23.