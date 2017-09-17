const BASE_URL = 'https://s3.amazonaws.com/band-together/'
const NAMES = [
  'kick',
  'clap',
  'snare',
  'hihat',
  'openhat',
  'ride',
  'crash',
  'tom',
  'shaker',
];

class Drums {

  constructor() {
    // request all files from the server
    this.buffers = [];
    this.context = new AudioContext();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    console.log(this.context);
    for (let i = 0; i < NAMES.length; i++) {
      let request = new XMLHttpRequest();
      request.open('GET', BASE_URL + NAMES[i] + '.wav', true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
	this.context.decodeAudioData(request.response, function(i, buffer) {
	  this.buffers[i] = buffer;
	}.bind(this, i), function() {});
      }.bind(this, i)
      request.send();
    }
  }

  play(note, duration) {
    if (note < 60 || note >= 60 + NAMES.length) {
      console.log('invalid drums note');
      return;
    }
    const buffer = this.buffers[note - 60];
    if (buffer != null) {
      let source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);
    }
  }
}

