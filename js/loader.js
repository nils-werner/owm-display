/*global jQuery, Highcharts, OWM */

(function ($, OWM) {

    "use strict";

    /**
     * @param {string|number} name
     * @param {string} [url]
     */
    var urlParam = function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        if (typeof name == "string") {
            var results = new RegExp('[\\#&?]!?' + name + '=([^&#]*)').exec(url);
            if (!results) {
                return undefined;
            }
            return results[1] || undefined;
        }
        else if (typeof name == "number") {
            var regex = /[\\#&?]!?([^&]*)/g;
            var i = 0;
            while ((results = regex.exec(url)) !== null) {
                if (i == name) {
                    return results[1] || undefined;
                }
                i++;
            }
            return undefined;
        }
    };

    /**
     * @param {object} d
     */
    var ISODateString = function (d) {
        function pad (n) {
            return (n < 10) ? '0' + n : n;
        }
        return d.getFullYear() + '-' +
            pad(d.getMonth() + 1) + '-' +
            pad(d.getDate()) + 'T' +
            pad(d.getHours()) + ':' +
            pad(d.getMinutes()) + ':' +
            pad(d.getSeconds());
    };

    /**
     * @param {string} id
     */
    var hide = function (id) {
	   $('#' + id).hide();
    };

    /**
     * @param {string} id
     */
    var show = function (id) {
        $('#' + id).show();
    };

    /**
     * @param {object} e
    */
    var errorHandler = function (e) {
        console.log(e.status + ' ' + e.statusText);
    };

    var dataReceived = false;

    var date = new moment();

    date.set('hour', 0);
    date.set('millisecond', 0);
    date.set('minute', 0);
    date.set('second', 0);

    date.subtract(1, 'days');

    var minus1 = date.toISOString();

    date.add(8, 'days');
    date.subtract(2, 'hours');

    var plus7 = date.toISOString();

    /**
     * @param {object} minus1
     * @param {object} plus7
     * @param {object} forecast
     */
    var mergeData = function (data, latitude, longitude) {

        dataReceived = true;

        var hourlyspan = [];
        var dailyspan = [];

        for (var i = 1; i < data.weather.length; i++) {
            hourlyspan.push(data.weather[i]);
        }

        var current;

        for (var i = 1; i < data.weather.length; i++) {
            if (moment(data.weather[i].timestamp).isBetween(
                moment(),
                moment().add(1, 'hours')
            )) {
                current = data.weather[i];
            }
        }

        var alerts = [{}];

        for (i = 0; i < data.weather.length; i++) {
            if(data.weather[i].solar < 0.05) {
                dailyspan.push(data.weather[i].timestamp);
            }
        }

        dailyspan = [];
        var sources = data.sources;

        renderData(hourlyspan, current, dailyspan, sources, alerts, latitude, longitude);

    };

    /**
     * @param {object} span
     * @param {array} future
     * @param {array} current
     * @param {array} daily
     */
    var renderData = function (span, current, daily, sources, alerts, latitude, longitude) {

        hide('loading');
        show('map-rain');
        show('map-lightning');
        show('suntimes');

        var owm = new OWM();

        // owm.highlightAlert('body', alerts);
        // owm.placeAlert('#text-warning', alerts);
        owm.dialTemperature('dial-temperature', current);
        owm.placeIcon('icon-weather', current);
        owm.placePin('pin', latitude, longitude);

        owm.dialWind('dial-wind', span);
        owm.plotPressure('chart-pressure', span, current, daily);
        owm.plotTemperature('chart-temp', span, daily);
        //owm.plotHumidity('chart-humidity', span, daily);
        owm.plotWindSpeed('chart-wind', span, daily);
        owm.plotRain('chart-rain', span, daily);
        owm.placeDate('date', span);
        // owm.placeSuntimes('suntimes', daily);
        owm.placeStation('station', sources);

    };


    var loadData = function (latitude, longitude, minus1, plus7) {
        $.when(
            $.ajax({
                url: "https://api.brightsky.dev/weather" +
                    "?lat=" + latitude.toString() +
                    "&lon=" + longitude.toString() +
                    "&date=" + minus1 +
                    "&last_date=" + plus7,
                type: 'GET',
                dataType: 'json',
                error: errorHandler,
                cache: true
            })
        ).done(
            function (a1) {
                mergeData(a1, latitude, longitude);
            }
        ).fail(
            function () {
                setTimeout (function () {
                    location.reload(true);
                }, 120000);
            }
        );
    };


    $(function() {

        var apikey;

        setTimeout (function () {
            if(!dataReceived) {
                location.reload(true);
            }
        }, 120000);

        if(urlParam('lat')) {
            loadData(urlParam('lat'), urlParam('long'), minus1, plus7)
        }
        else if(urlParam('position')) {
            var latlong = urlParam('position').split(',');
            loadData(latlong[0], latlong[1], minus1, plus7)
        }
        else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var latitude = Math.round(position.coords.latitude * 1000) / 1000
                    var longitude = Math.round(position.coords.longitude * 1000) / 1000
                    loadData(latitude, longitude, minus1, plus7);
                },
                function() {
                    loadData(49.1308061, 10.9235329, minus1, plus7)
                });
        }
        else {
            loadData(49.1308061, 10.9235329, minus1, plus7)
        }

    });

}(jQuery, OWM));
