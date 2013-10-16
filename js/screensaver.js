jQuery(document).ready(function() {
    screensaverOffset(50);
});

function screensaverOffset(pixels) {
    vertical = Math.floor(Math.random()*pixels+1);
    horizontal = Math.floor(Math.random()*pixels+1);

    $("body").css("position", "relative");
    $("body").css("top", vertical);
    $("body").css("left", horizontal);
}