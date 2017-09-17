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
    commandProcessor.fire(new AddTrack(globalSessionId + "-" + model.tracks.length));
}

var trackId = 0;
function addTrack(index, trackData){
    $.get('./components/track.html', function(data){
        $(data).find(".track").id("track" + index);
        $('#trackContainer').append(data);
        initTrack();
        $('.track').on('click', function(){
            //open instrument container if one doesn't exist
            if($('#keyboard').length == 0) {
                $.get('./components/keyboard.html', function(data){
                    $('#instrumentContainer').html(data);
                });
            }
        });
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
