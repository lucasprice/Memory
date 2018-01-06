function preload_images() {
    let images = [];
    let loaded_images = 0;

    let image_files = [
        "images/Skull.png",
        "images/House 1.png",
        "images/House 2.png",
        "images/House 3.png"
    ];

    function image_loaded() {
        loaded_images++;
        if (loaded_images == image_files.length) {
            post_loaded(images);
        }
    }

    for (i = 0; i < image_files.length; i++) {
        images.push(new Image())
        images[i].src = image_files[i];
        images[i].onload = function() {
            image_loaded();
        }
    }

    return {
        done:function(f) {
            post_loaded = f || post_loaded;
        }
    }
}

/* Get cavas context. */
let c = document.getElementById("canvas").getContext("2d");

/* The number of cards. */
let rows = 4;
let columns = 6;

let x_width = (1000 - 2 * 5 - (columns - 1) * 5) / columns;
let y_width = (1000 - 2 * 5 - (rows - 1) * 5) / rows;

/* Pre-load all images. */
preload_images().done(function(images) {

    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            c.drawImage(images[0],
                        5 + j * x_width + j * 5,
                        5 + i * y_width + i * 5,
                        x_width, y_width);
        }
    }
})
