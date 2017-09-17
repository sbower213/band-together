var commandProcessor;
var model;
var globalSessionId;

$(document).ready(function() {
    model = new Model();
    commandProcessor = new CommandProcessor(model);
    globalSessionId = Math.floor(Math.random() * 10000000);
    
    model.registerAddTrackListener(addTrack);
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
        $(".track").last().attr("id","track" + index);
        initTrack($("#track" + index));
    });
}

function executeDeleteTrackCommand(trackId){
    commandProcessor.fire(new DeleteTrack(trackId));
}

function deleteTrack(trackId){
    $('#'+trackId).remove();
}

function executeModifyTrackCommand(trackId, modification){
    commandProcessor.fire(new ModifyTrack(trackId, modification));
}

function modifyTrack(trackId, modification){

}
