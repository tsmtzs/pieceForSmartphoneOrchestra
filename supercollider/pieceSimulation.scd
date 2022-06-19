// //////////////////////////////////////////////////
// Piece for Smartphone Orchestra
//	by Tassos Tsesmetzis
//
// A (sort of) simulation.
// //////////////////////////////////////////////////

(
SynthDef(\sine, { |out = 0, freq = 200, amp = 0.05, attack = 2, release = 4, gate = 1.0, pan = 0.0|
	var sig, env;

	sig = SinOsc.ar(freq, 0, amp);
	env = EnvGen.kr(Env.asr(attack, 1, release), gate, doneAction: Done.freeSelf);

	Out.ar(out, Pan2.ar(sig * env, pan));
}).add;

SynthDef(\reverb, { |in, out, room = 0.2, mix = 0.3, damp = 0.1, amp = 1.0|
	var sig;
	sig = In.ar(in, 2);
	sig = FreeVerb.ar(sig, mix, room, damp, amp);
	ReplaceOut.ar(out, sig)
}).add;
)

(
var baseFreq = 87.midicps;
var voices = 16;
var firstPart = 140, secondPart = 280;	// time (sec)

Ppar({ |i|
	Pbind(
		\time, Pseg([0, 1, 0], [firstPart, secondPart], [2, -3]),
		\instrument, Pwrand([\sine,Rest()], [0.7, 0.3], inf),
		\midinote, 12 * Prand((..2), inf) + baseFreq.cpsmidi,
		\ctranspose, Pfunc { |ev| ev.time.cubed.rand2 },
		\amp, Pfunc { |ev| 0.002.rrand(0.03) * ev.time } + Pwrand([0.002, 0.0], [0.1, 0.9], inf),
		\attack, Pmeanrand(2, 12),
		\release, Pmeanrand(1, 12),
		\pan, i.linlin(0, voices - 1, -0.9, 0.9),
		\dur, Pmeanrand(20, 35),
		\out, 0
	) } ! voices)
.play;

Synth(\reverb, [\in, 0, \out, 0, \room, 0.3, \mix, 0.5, \damp, 0.3], addAction: \addToTail);
)
