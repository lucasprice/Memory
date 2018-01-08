/* From http://www.javascriptkit.com/javatutors/preloadimagesplus.shtml */
function preload_images(images_files) {
    let images = [];
    let loaded_images = 0;

    function image_loaded() {
        loaded_images++;
        if (loaded_images == image_files.length) {
            post_loaded(images);
        }
    }

    /* Loop over image files and load them. For each specify the
     * `image_loaded` function for the `onload` event to keep track of
     * how many images are already loaded. */
    for (i = 0; i < image_files.length; i++) {
        images.push(new Image())
        images[i].src = image_files[i];
        images[i].onload = function() {
            image_loaded();
        }
    }

    /* Add a `done` method and return the empty function or the
     * function passed into `preload_images()` function as
     * argument. */
    return {
        done: function(f) {
            post_loaded = f || function() {};
        }
    }
}

function place_tile(tile, back, tiles) {
    if (tile.hidden) {
        ctx.drawImage(back,
                      tile.x,
                      tile.y,
                      x_width, y_width);
    } else {
        ctx.drawImage(tiles[tile.group][tile.image],
                      tile.x,
                      tile.y,
                      x_width, y_width);
    }
}

function flip_tile(tile, back, tiles) {
    tile.hidden = ! tile.hidden;
    place_tile(tile, back, tiles);
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

/* The image files. */
let image_files = [
    "images/back.png",
    "images/Skull.png",
    "images/Skull.png",
    "images/Skull.png",
    "images/House 1.png",
    "images/House 2.png",
    "images/House 3.png"
];

/* The number of cards. */
let number_of_tiles = 2;
let images_per_tile = 2;

if (number_of_tiles * images_per_tile > image_files.length - 1)
{
    alert("too many tiles");
}

/* How to organize the tiles. */
let rows = 2;
let columns = Math.floor(images_per_tile * number_of_tiles / rows);

/* Width and height of a tile. */
let x_width = (1000 - 2 * 5 - (columns - 1) * 5) / columns;
let y_width = (1000 - 2 * 5 - (rows - 1) * 5) / rows;

/* Pre-load all images. */
preload_images(image_files).done(function(images) {

    /* The first image is the tile background. */
    let back = images.shift();

    /* Helper array to keep track of which images were already
     * chosen. */
    let free_tiles = new Array();

    /* Organize the images in groups. We assume that each image has
     * three versions. */
    let image_groups = [];
    for (i = 0; i < images.length; i += 3) {
        let temp = {
            index: Math.floor(i / 3),
            images: [ 0, 1, 2 ]
        }
        free_tiles.push(temp);
        image_groups.push([]);
        for (j = 0; j < 3; j++) {
            image_groups[image_groups.length-1].push(images[i + j]);
        }
    }

    /* Assign positions to the tiles. */
    let tiles = []
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            /* Randomly choose tiles. We will first pick an image
             * group and then 2 images from it. */
            let free_group_index = Math.floor(Math.random() * free_tiles.length);
            let free_image_index = Math.floor(Math.random() * free_tiles[free_group_index].images.length);

            let group_index = free_tiles[free_group_index].index;
            let image_index = free_tiles[free_group_index].images[free_image_index];

            free_tiles[free_group_index].images.splice(free_image_index, 1);
            if (free_tiles[free_group_index].images.length <= 1) {
                free_tiles.splice(free_group_index, 1);
            }

            let temp = {
                group: group_index,
                image: image_index,
                hidden: true,
                x: 5 + j * x_width + j * 5,
                y: 5 + i * y_width + i * 5
            };
            tiles.push(temp);
        }
    }

    /* Initially place the tiles. */
    for (n = 0; n < tiles.length; n++) {
        place_tile(tiles[n], back, image_groups);
    }

    let number_of_flipped_tiles = 0;

    /* The game code. */
    c.onclick = function(e) {
        mouse_position = get_mouse_position(c, e);
        for (n = 0; n < tiles.length; n++) {
            if (mouse_position.x >= tiles[n].x &&
                mouse_position.x <= tiles[n].x + x_width &&
                mouse_position.y >= tiles[n].y &&
                mouse_position.y <= tiles[n].y + y_width)
            {
                flip_tile(tiles[n], back, image_groups);

                /* Check how many tiles are flipped. */
                number_of_flipped_tiles++;
                if (number_of_flipped_tiles == images_per_tile) {
                }
            }
        }
})
