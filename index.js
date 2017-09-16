function executeAddTrackCommand(){
    addTrack(); //need params for initial instrument type?
}

function addTrack(){
    $.get('./components/track.html', function(data){
        $('#trackContainer').append(data);
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
