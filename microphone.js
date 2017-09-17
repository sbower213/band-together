navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

class Microphone {

  constructor() {
    this.buffer = null;
    this.context = new AudioContext();
    this.recorder = null;
    navigator.getUserMedia(
      {audio: true, video: false},
      function(stream) {
	const source = this.context.createMediaStreamSource(stream);
	this.recorder = new Recorder(source);
      }.bind(this),
      function() {}, // error
    );
  }
  
  play(note, duration) {
    if (this.buffer != null) {
      const source = this.context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.context.destination);
      source.start(0);
    }
  }
  
  startRecord() {
    if (this.recorder) {
      this.source = null;
      this.recorder.record();
    }
  }	

  stopRecord() {
    if (this.recorder) {
      this.recorder.stop();
      this.recorder.getBuffer(function(buffers) {
	let newBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	  this.buffer = newBuffer;

          FireBaseHandler.uploadAudio(this.buffer, function(snapshot) {
              console.log("download url: " + snapshot.downloadURL);
          });
      }.bind(this));
    }
  }
}

