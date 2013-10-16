jQuery(document).ready(function() {
    screensaverOffset(25);
});

function screensaverOffset(pixels) {
    vertical = Math.floor(Math.random()*pixels*2+1) - pixels;
    horizontal = Math.floor(Math.random()*pixels*2+1) - pixels;

    $("body").css("position", "relative");
    $("body").css("top", vertical);
    $("body").css("left", horizontal);
}