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
var baseFreq = 87.midicps;
var voices = 15, pat;
var firstPart = 140, secondPart = 280;
var path = "./pieceASimulation_15voices.aiff";

pat = Ppar({|i|
	Pbind(
		\time, Pseg([0, 1, 0], [firstPart, secondPart], [2, -3]),
		\instrument, Pwrand([\sine,Rest()], [0.7, 0.3], inf),
		\midinote, 12 * Prand([1, 2, 3], inf) + baseFreq.cpsmidi,
		\ctranspose, Pfunc {|ev| ev.time.cubed.rand2},
		\amp, Pfunc {|ev| 0.002.rrand(0.03) * ev.time} + Pwrand([0.002, 0.0], [0.1, 0.9], inf),
		\attack, Pmeanrand(2, 12),
		\release, Pmeanrand(1, 12),
		\pan, i.linlin(0, voices - 1, -0.9, 0.9),
		\dur, Pmeanrand(20, 35)
	)} ! voices);

// pat.play;
// Record as 'aiff' file
pat.record(path);

)

// //////////////////////////////////////////////////
// Some calculations for otoacoustic emission freqs
// //////////////////////////////////////////////////
(
var baseFreq = 1864.66.cpsmidi;
var freqs, qap, cap;

freqs = baseFreq + .x [-1, 0, 1];
freqs =freqs.midicps;

qap = 2 * freqs -.x freqs;
cap = freqs -.x freqs;

"* ********************\n* QAP 2f2 - f1 freq".postln;
qap.asSet.select({|elem| elem > 0 }).asArray.sort.do {|elem| "\t %\n".postf(elem)};
//
"* ********************\n* CAP f2 - f1 freq".postln;
cap.asSet.select({|elem| elem > 0 }).asArray.sort.do {|elem| "\t %\n".postf(elem)};
)

(
var baseFreq = 1864.66.cpsmidi;
var centerFreqs = [0, 12, 24] + baseFreq;
var freqs, qap, cap;

freqs = centerFreqs + .x [-1, 0, 1];
freqs =freqs.midicps;

qap = 2 * freqs -.x freqs;
cap = freqs -.x freqs;

"* ********************\n* QAP 2f2 - f1 freq:".postln;
qap.asSet.select({|elem| elem > 0 }).asArray.sort.do {|elem| "\t %\n".postf(elem)};
//
"* ********************\n* CAP f2 - f1 freq".postln;
cap.asSet.select({|elem| elem > 0 }).asArray.sort.do {|elem| "\t %\n".postf(elem)};
)