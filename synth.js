window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
const HERTZ = 440; // MIDI 69 to Hertz

class Synth {
  constructor(type1, type2) {
    this.type1 = type1;
    this.type2 = type2;
    this.offset = 0;
    this.mix = 0.5;
  }

  play(note, duration) {
    let osc = audioContext.createOscillator();
    let osc2 = audioContext.createOscillator();
    let gainOsc = audioContext.createGain();
    let gainOsc2 = audioContext.createGain();

    osc.type = this.type1;
    osc2.type = this.type2;

    osc.frequency.value = HERTZ;
    osc2.frequency.value = HERTZ;
    osc.detune.value = (note - 69) * 100;
    osc2.detune.value = (note - 69) * 100 + this.offset;

    gainOsc.gain.setValueAtTime(1 - this.mix, audioContext.currentTime);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    gainOsc2.gain.setValueAtTime(this.mix, audioContext.currentTime);
    gainOsc2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(gainOsc);
    osc2.connect(gainOsc2);
    gainOsc.connect(audioContext.destination);
    gainOsc2.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime);
    osc2.start(audioContext.currentTime);
    
    osc.stop(audioContext.currentTime + duration);
    osc2.stop(audioContext.currentTime + duration);
  }
}

var synth = new Synth('sine', 'square');

function play() {
  synth.offset = 2410;
  synth.mix = 0.1;
  noteSeq = [60, 64, 67, 64];
  let i = 0;
  while (i < 16) {
    setTimeout(function(idx) {
      synth.play(noteSeq[idx % noteSeq.length] - 12, 1);
    }.bind(this, i), i * 200);
    i++;
  }

}
