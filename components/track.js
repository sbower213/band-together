

function initTrack(track) {
    track.on('click', function(e) {
        if (!$(".track.expanded").is(track)) {
	        expandedTrack = track;
            $(".note").draggable('disable');
            $(".track.expanded .note").each(function(index) {
                $(this).css({left:$(this).position().left, top: $(this).position().top * 0.5});
            });
            //        $(".track.expanded").css("transform", "");
            $(".track").removeClass('expanded');
            track.addClass('expanded');

            $(".trackData.expanded").css("transform", "scale(1, 2)");
            $(".track.expanded .note").each(function(index) {
                $(this).css({left:$(this).position().left, top:2 * $(this).position().top});
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
            var mouseY = e.pageY - track.offset().top * .5;
            var beat = Math.floor(mouseX / 40);
            var pitch = Math.ceil(mouseY / (track.height() / 12.0)) + 60;
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

function noteDragged() {
    console.log("note dragged!");
}
