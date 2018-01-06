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

function place_tile(tile) {
    if (tile.hidden) {
        ctx.drawImage(tile.back,
                      tile.x,
                      tile.y,
                      x_width, y_width);
    } else {
        ctx.drawImage(tile.front,
                      tile.x,
                      tile.y,
                      x_width, y_width);
    }
}

function flip_tile(tile) {
    tile.hidden = ! tile.hidden;
    place_tile(tile);
}

function get_mouse_position(canvas, event) {
    return {
        x: (event.clientX - canvas_rect.left) / (canvas_rect.right - canvas_rect.left) * 1000,
        y: (event.clientY - canvas_rect.top) / (canvas_rect.bottom - canvas_rect.top) * 1000
    }
}

/* Get cavas context. */
let c = document.getElementById("canvas")
let ctx = document.getElementById("canvas").getContext("2d");

let canvas_rect = canvas.getBoundingClientRect();
let mouse_position = { x: 0, y: 0 }

/* The number of cards. */
let rows = 2;
let columns = 3;

/* Width and height of a tile. */
let x_width = (1000 - 2 * 5 - (columns - 1) * 5) / columns;
let y_width = (1000 - 2 * 5 - (rows - 1) * 5) / rows;

/* Pre-load all images. */
preload_images().done(function(images) {

    let tiles = []
    for (i = 0; i < rows; i++) {
        tiles[i] = new Array(columns);
        for (j = 0; j < columns; j++) {
            tiles[i][j] = {
                front: images[0],
                back: images[1],
                hidden: true,
                x: 5 + j * x_width + j * 5,
                y: 5 + i * y_width + i * 5
            }
        }
    }

    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            place_tile(tiles[i][j]);
        }
    }

    /* Define what happens when the user clicks on the canvas. */
    c.onclick = function(e) {
        mouse_position = get_mouse_position(c, e);
        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
                if (mouse_position.x >= tiles[i][j].x &&
                    mouse_position.x <= tiles[i][j].x + x_width &&
                    mouse_position.y >= tiles[i][j].y &&
                    mouse_position.y <= tiles[i][j].y + y_width) {
                    flip_tile(tiles[i][j]);
                }
            }
        }
    }
})
