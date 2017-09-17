const LOWER_MIDI = 36;
const UPPER_MIDI = 107;
const KEYBOARD_MAP = {
  'a': 60,
  'w': 61,
  's': 62,
  'e': 63,
  'd': 64,
  'f': 65,
  't': 66,
  'g': 67,
  'y': 68,
  'h': 69,
  'u': 70,
  'j': 71,
  'k': 72,
  'o': 73,
  'l': 74,
  'p': 75,
  ';': 76,
  '\'': 77,
  ']': 78,
}

var commandProcessor;
var model;
var pressedKeys;
var globalSessionId;
var expandedTrack;
var deletedTracks = [];
var oldColors;


$(document).ready(function() {
    model = new Model();
    commandProcessor = new CommandProcessor(model);
    pressedKeys = {};
    globalSessionId = Math.floor(Math.random() * 10000000);
    expandedTrack = null;
    oldColors = {};

    model.registerAddTrackListener(addTrack);
    model.registerAddNoteListener(addNote);
    model.registerDeleteTrackListener(deleteTrack);

    $(document).keydown(function(event) {
        if (pressedKeys[event.key]) {
	  return;
	}
        if (expandedTrack) {
	    const trackID = expandedTrack[0].id;
 	    const name = model.tracks[trackID].trackData.instrument.name;;
	    if (name == 'synth') {
 	        const instr = model.tracks[trackID].instrument;
	        pressedKeys[event.key] = true;
	        if (KEYBOARD_MAP[event.key]) {
	          instr.play(KEYBOARD_MAP[event.key], 2);
              oldColors[event.key] = $('#key-' + KEYBOARD_MAP[event.key]).css('background-color');
              $('#key-' + KEYBOARD_MAP[event.key]).css('background-color', '#999999');
		    }
	    }
	}
    });

    $(document).keyup(function(event) {
      if (pressedKeys[event.key]) {
	      pressedKeys[event.key] = false;
          $('#key-' + KEYBOARD_MAP[event.key]).css('background-color', oldColors[event.key])
          delete oldColors[event.key];
      }
    });
});



function executeAddTrackCommand(){
    commandProcessor.fire(new AddTrack(globalSessionId + "-" + Object.keys(model.tracks).length,
                                       {
                                           tempo:120,
                                           instrument:{
                                               name: "synth",
                                               mix: .5,
                                               offset: 0
                                           }
                                       }));
}

var trackId = 0;
function addTrack(index, trackData){

    
        console.log(index)
        $.get('./components/track.html', function(data){
            if(deletedTracks.indexOf(index) < 0) {
                $('#trackContainer').append(data);
                $(".track").last().attr("id","" + index);
                $(".delete").last().attr("onclick","executeDeleteTrackCommand('"+index+"')")
                initTrack($("#" + index));

                for (var i in queuedNotes) {
                    if (queuedNotes[i].track == index) {
                        addNote(queuedNotes[i].track, queuedNotes[i].beat, queuedNotes[i].noteData);
                        delete queuedNotes[i];
                    }
                }
    $.get('./components/track.html', function(data){
        $('#trackContainer').append(data);
        $(".track").last().attr("id","" + index);
        $(".delete").last().attr("onclick","deleteTrack('"+index+"')")
        initTrack($("#" + index));

        for (var i in queuedNotes) {
            if (queuedNotes[i].track == index) {
                addNote(queuedNotes[i].track, queuedNotes[i].beat, queuedNotes[i].noteData);
                delete queuedNotes[i];
            }
        });
     
    
}

function executeDeleteTrackCommand(trackId){
    commandProcessor.fire(new DeleteTrack(trackId));
}

function deleteTrack(track_index){
    deletedTracks.push(track_index);
    $('#'+track_index).remove();
}

function executeModifyTrackCommand(trackId, modification){
    commandProcessor.fire(new ModifyTrack(trackId, modification));
}

function modifyTrack(trackId, modification){

}

var queuedNotes = [];
function addNote(track, beat, noteData) {
    if ($("#" + track).length == 0) {
        queuedNotes.push({track:track, beat:beat, noteData:noteData});
        return;
    }
    if ($("#" + beat + "-" + noteData.pitch).length == 0) {
        var div = $("<div class='note' id='" + beat + "-" + noteData.pitch + "'></div>");
        $("#" + track + " .trackData").append(div);
        div = $("#" + beat + "-" + noteData.pitch);
        div.offset({left: beat * 40, top: (noteData.pitch - 60) * $("#" + track).height() / 12.0});
        div.css("width", (noteData.duration * 40) + "px");
        div.draggable({ containment: "parent",
                        grid: [40, $(".trackData").height() / 12.0 * 2],
                        stop: noteDragged,
                        disabled: true
                      });
    }

}
