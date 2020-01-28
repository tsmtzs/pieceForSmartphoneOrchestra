// //////////////////////////////////////////////////
// Study for smartphone orchestra
//	Piece A
//
// A (sort of) sound simulation.
// //////////////////////////////////////////////////

(
SynthDef(\sine, {|out = 0, freq = 200, amp = 0.05, attack = 2, release = 4, gate = 1.0, pan = 0.0|
	var sig, env;

	sig = SinOsc.ar(freq, 0, amp);
	env = EnvGen.kr(Env.asr(attack, 1, release), gate, doneAction: Done.freeSelf);

	Out.ar(out, Pan2.ar(sig * env, pan));
}).add;
)

(
var baseFreq = 932.33;
var voices = 15, pat;
var firstPart = 140, secondPart = 280;

pat = Ppar({|i|
	Pbind(
		\time, Pseg([0, 1, 0], [firstPart, secondPart], [2, -3]),
		\instrument, Pwrand([\sine,Rest()], [0.6, 0.4], inf),
		\midinote, 12 * Prand([0, 1, 2], inf) + baseFreq.cpsmidi,
		\ctranspose, Pfunc {|ev| ev.time.cubed.rand2},
		\amp, Pfunc {|ev| 0.001.rrand(0.012) * ev.time} + Pwrand([0.002, 0.0], [0.1, 0.9], inf),
		\attack, Pmeanrand(1, 12),
		\release, Pmeanrand(1, 12),
		\pan, i.linlin(0, voices - 1, -0.9, 0.9),
		\dur, Pmeanrand(14, 35)
	)} ! voices);

Pdef(\a, pat).play;
)