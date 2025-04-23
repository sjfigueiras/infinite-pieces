import { SonicPiece } from "../registry";
import * as Tone from "tone";

const synth = new Tone.Synth();

const melodySynth = new Tone.AMSynth();

const seq1 = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
}, ["C3", ["E3", "D3", "E3"], "G3", ["A3", "G3"]]).start(0);

const seq2 = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.8, time);
	// subdivisions are given as subarrays
}, ["C3", ["F#3", "E3", "F#3"], "A3", ["B3", "A3"]]).start(1);

const seq3 = new Tone.Sequence((time, note) => {
    melodySynth.triggerAttackRelease(note, 1.1, time);
    // subdivisions are given as subarrays
}, ["Bb2", "F3", ["C4", "Bb3"]]).start(2);

const verb = new Tone.Reverb({
    decay: 1.5,
    preDelay: 0.01,
    wet: 0.8,
});

const delay = new Tone.FeedbackDelay({
    delayTime: 0.25,
    feedback: 0.1,
    wet: 0.5,
});

synth.connect(verb);
melodySynth.connect(verb);
synth.connect(delay);
melodySynth.connect(delay);
verb.toDestination();
delay.toDestination();

Tone.getTransport().bpm.value = 40; // Set the BPM to 120
Tone.getTransport().start();

const loops: SonicPiece = {
  title: "Loops",
  modulators: [],
};

export default loops;
