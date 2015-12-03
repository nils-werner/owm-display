(function ($) {

    "use strict";

    /**
     * @param {number} pixels
     */
    var screensaverOffset = function (pixels) {

        var vertical = Math.floor(Math.random() * pixels * 2 + 1) - pixels;
        var horizontal = Math.floor(Math.random() * pixels * 2 + 1) - pixels;

        $("body").css({
            "position": "relative",
            "top": vertical,
            "left": horizontal
        });
    };

    screensaverOffset(25);

}(jQuery));