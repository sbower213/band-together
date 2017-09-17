

function initTrack() {
    $(".note").draggable({ containment: "parent",
                           grid: [40, $(".trackData").height() / 12.0],
                           stop: noteDragged
                         });
}

function noteDragged() {
    console.log("note dragged!");
}
