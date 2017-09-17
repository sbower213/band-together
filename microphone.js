navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var soundBank = {};

class Microphone {

  constructor(track) {
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
      this.recording = false;
      this.startBeat = 0;
      this.track = track;
  }
  
  play(note, duration) {
    if (this.buffer != null) {
      const source = this.context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.context.destination);
      source.start(0);
    }
  }

    toggleRecording() {
        if (this.recording) {
            this.stopRecord();
        } else {
            this.startRecord();
        }
    }
  
  startRecord() {
      if (this.recorder) {
          this.startBeat = model.beat;
      this.source = null;
        this.recorder.record();
        this.recording = true;
    }
  }	

  stopRecord() {
      if (this.recorder) {
          this.recording = false;
      this.recorder.stop();
      this.recorder.getBuffer(function(buffers) {
	let newBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	  this.buffer = newBuffer;

          FireBaseHandler.uploadAudio(this.buffer, (function(snapshot) {
              console.log("download url: " + snapshot.downloadURL);
              commandProcessor.fire(new AddSound('' + globalSessionId + '_' + audioCounter,
                                                 buffers[0].length,
                                                 this.context.sampleRate,
                                                 snapshot.downloadURL));
              commandProcessor.fire(new InsertNote(this.track,
                                                   this.startBeat,
                                                   65,
                                                   {
                                                       pitch:65,
                                                       duration:5,
                                                       soundIndex:'' + globalSessionId + '_' + audioCounter
                                                   }));
          }).bind(this));
      }.bind(this));
    }
  }

    load(index) {
        var soundData = soundBank[index];
        var bufferLength = soundData.bufferLength;
        var sampleRate = soundData.sampleRate;
        var downloadUrl = soundData.downloadUrl;

        var request = new XMLHttpRequest();
        request.open('GET', downloadUrl, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            var audioData = request.response;

            this.context.decodeAudioData(audioData, (function(buffer) {
                 let newBuffer = this.context.createBuffer(2, bufferLength, sampleRate);

                newBuffer.getChannelData(0).set(buffer);
                newBuffer.getChannelData(1).set(buffer);
                this.buffer = newBuffer;

                soundBank[index] = this;
            }).bind(this),
                                     
             function(e){ console.log("Error with decoding audio data" + e.err); });

        };

        request.send();
    }
}

