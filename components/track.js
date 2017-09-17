function openDrums(track) {
    const trackID = track[0].id;
    $('#instrumentContainer').empty();
    $.get('./components/drumpad.html', function(data){
        $('#instrumentContainer').html(data);
	for (let midi = 0; midi <= 9; midi++) {
	    $('#drum-' + midi).mousedown(function(event) {
		const midi = event.target.id.split('-')[1];
		model.tracks[trackID].playNote(midi, 1);
	    });
	}
    });
}

function openKeyboard(track) {
    $('#instrumentContainer').empty();
    $.get('./components/keyboard.html', function(data){
        $('#instrumentContainer').html(data);
	for (let midi = LOWER_MIDI; midi <= UPPER_MIDI; midi++) {
	    $('#key-' + midi).mousedown(function(event) {
		const trackID = track[0].id;
		const midi = event.target.id.split('-')[1];
		model.tracks[trackID].playNote(midi, 2);
	    });
	}
    });
}

function openInstrument(instrumentName, track) {
    if(instrumentName == "synth") {
        if($('#keyboard').length == 0) {
	    openKeyboard(track);
	}
    }
    else if(instrumentName == "bass") {
        if($('#keyboard').length == 0) {
	    openKeyboard(track);
	}
    } else if (instrumentName == "drums") {
        if($('#drumpad').length == 0) {
            openDrums(track);
        }
    }
}

function initTrack(track) {
    const select = track.find("select");
    const trackID = track[0].id;
    select.val(model.tracks[trackID].trackData.instrument.name);
    select.change(function(event) {
	const trackID = track[0].id;
	model.tracks[trackID].trackData.instrument.name = select.val();
        openInstrument(select.val(), track);
        commandProcessor.fire(new ModifyTrack(trackID,
                                              model.tracks[trackID].trackData));
    });
    track.find(".trackData").on('click', function(e) {
        if (!$(".track.expanded").is(track)) {
	    expandedTrack = track;
            $(".note").draggable('disable');
            $(".track.expanded .note").each(function(index) {
                $(this).position({left:$(this).position().left, top:.5 * $(this).position().top});
            });
            //        $(".track.expanded").css("transform", "");
            $(".track").removeClass('expanded');
            track.addClass('expanded');

            $(".track.expanded .note").each(function(index) {
                $(this).position({left:$(this).position().left, top:2 * $(this).position().top});
            });
            track.find(".note").draggable('enable');
            //open instrument container if one doesn't exist
            var instrumentName = model.tracks[trackID].trackData.instrument.name;
            openInstrument(instrumentName, track);
        } else {
            var mouseX = e.pageX - track.find(".trackData").offset().left;
            var mouseY = e.pageY - track.find(".trackData").parent().offset().top;
            var beat = Math.floor(mouseX / 53.583);
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
    var duration = ui.helper.style("width") / 40;
    commandProcessor.fire(new DeleteNote(track,
                                         beat,
                                         pitch));

    var mouseX = e.pageX - parent.offset().left;
    var mouseY = e.pageY - parent.offset().top;
    beat = Math.floor(mouseX / 54);
    pitch = Math.floor(mouseY / (parent.height() / 12.0)) + 60;
    commandProcessor.fire(new InsertNote(track,
                                         beat,
                                         pitch,
                                         {
                                             pitch: pitch,
                                             duration: duration
                                         }));
}
