

function initTrack(track) {
    track.find(".note").draggable({ containment: "parent",
                                    grid: [40, $(".trackData").height() / 12.0 * 2],
                                    stop: noteDragged,
                                    disabled: true
                                  });

    track.on('click', function() {
        $(".note").draggable('disable');
        $(".track.expanded .note").each(function(index) {
            $(this).offset({left:$(this).offset().left, top:.5 * $(this).offset().top});
        });
        $(".track").removeClass('expanded');
        track.addClass('expanded');
        
        $(".track.expanded .note").each(function(index) {
            $(this).offset({left:$(this).offset().left, top:2 * $(this).offset().top});
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
