

function initTrack() {
    $(".note").draggable({ containment: "parent",
                           grid: [40, 40],
                           axis: "x",
                           stop: noteDragged
                         });
}

function noteDragged() {
    console.log("note dragged!");
}
