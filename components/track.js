

function initTrack(track) {
    track.find(".note").draggable({ containment: "parent",
                                    grid: [40, $(".trackData").height() / 12.0 * 2],
                                    stop: noteDragged,
                                    disabled: true
                                  });

    track.on('click', function() {
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
            });
        }
    });
}

function noteDragged() {
    console.log("note dragged!");
}
