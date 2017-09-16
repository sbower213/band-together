function executeAddTrackCommand(){
    addTrack(); //need params for initial instrument type?
}

function addTrack(){
    $.get('./components/track.html', function(data){
        $('#trackContainer').append(data);
    });
}

function executeDeleteTrackCommand(trackId){
    deleteTrack(trackId);
}

function deleteTrack(trackId){
    $('#'+trackId).remove();
}

function executeModifyTrackCommand(trackId, modification){
    modifyTrack(trackId, modification);
}

function modifyTrack(trackId, modification){

}
