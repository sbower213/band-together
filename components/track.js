

function initTrack(track) {
    track.on('click', function(e) {
        if (!$(".track.expanded").is(track)) {
	    expandedTrack = track;
            $(".note").draggable('disable');
            $(".track.expanded .note").each(function(index) {
                $(this).position({left:$(this).position().left, top:.5 * $(this).position().top});
            });
            //        $(".track.expanded").css("transform", "");
            $(".track").removeClass('expanded');
            track.addClass('expanded');
            
            $(".trackData.expanded").css("transform", "scale(1, 2)");
            $(".track.expanded .note").each(function(index) {
                $(this).position({left:$(this).position().left, top:2 * $(this).position().top});
            });
            track.find(".note").draggable('enable');
            //open instrument container if one doesn't exist
            if($('#keyboard').length == 0) {
                $.get('./components/keyboard.html', function(data){
                    $('#instrumentContainer').html(data);
		    for (let midi = LOWER_MIDI; midi <= UPPER_MIDI; midi++) {
		        $('#key-' + midi).mousedown(function(event) {
		            const trackID = track[0].id;
		            const midi = event.target.id.split('-')[1];
		            model.tracks[trackID].instrument.play(midi, 2);
			});
		    }
                });
            }
        } else {
            var mouseX = e.pageX - track.offset().left;
            var mouseY = e.pageY - track.offset().top;
            var beat = Math.floor(mouseX / 40);
            var pitch = Math.floor(mouseY / (track.height() / 12.0)) + 60;
            commandProcessor.fire(new InsertNote(track.attr("id"),
                                                 beat,
                                                 pitch,
                                                 {
                                                     pitch: pitch,
                                                     duration: 1
                                                 }));
                                                     
        }
    });
}

function noteDragged(e, ui) {
    var parent = ui.helper.parent();

    var id = ui.helper.attr("id");
    var beat = parseInt(id.substring(0,id.indexOf("-")));
    var pitch = parseInt(id.substring(id.indexOf("-") + 1, id.indexOf("_")));
    var track = id.substring(id.indexOf("_") + 1);
    commandProcessor.fire(new DeleteNote(track,
                                         beat,
                                         pitch));

    var mouseX = e.pageX - parent.offset().left;
    var mouseY = e.pageY - parent.offset().top;        
    beat = Math.floor(mouseX / 40);
    pitch = Math.floor(mouseY / (parent.height() / 12.0)) + 60;
    commandProcessor.fire(new InsertNote(track,
                                         beat,
                                         pitch,
                                         {
                                             pitch: pitch,
                                             duration: 1
                                         }));
}
