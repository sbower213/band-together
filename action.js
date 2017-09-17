const LOWER_MIDI = 36;
const UPPER_MIDI = 107;

var commandProcessor;
var model;
var globalSessionId;

$(document).ready(function() {
    model = new Model();
    commandProcessor = new CommandProcessor(model);
    globalSessionId = Math.floor(Math.random() * 10000000);

    model.registerAddTrackListener(addTrack);
    model.registerAddNoteListener(addNote);
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
        }
    });
}

function executeDeleteTrackCommand(trackId){
    commandProcessor.fire(new DeleteTrack(trackId));
}

function deleteTrack(track_index){
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
        div.offset({left: beat * 40, top: noteData.pitch * $("#" + track).height() / 12.0});
        div.css("width", (noteData.duration * 40) + "px");
        div.draggable({ containment: "parent",
                        grid: [40, $(".trackData").height() / 12.0 * 2],
                        stop: noteDragged,
                        disabled: true
                      });
    }

}
