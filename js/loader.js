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

    var date = new Date();

    date.setHours(0);
    date.setMilliseconds(0);
    date.setMinutes(0);
    date.setSeconds(0);

    var minus1 = ISODateString(date);

    date.setDate(date.getDate() - 1);

    var minus2 = ISODateString(date);

    /**
     * @param {object} minus1
     * @param {object} minus2
     * @param {object} forecast
     */
    var mergeData = function (minus1, minus2, forecast) {

        dataReceived = true;

        var hourlyspan = [];
        var dailyspan = [];
        var current = forecast.currently;

        for (var i = 1; i < minus2.hourly.data.length; i++) {
            if(minus2.hourly.data[i].time < minus1.hourly.data[0].time) {
                hourlyspan.push(minus2.hourly.data[i]);
            }
        }

        for (i = 0; i < minus1.hourly.data.length; i++) {
            if(minus1.hourly.data[i].time < forecast.hourly.data[0].time) {
                hourlyspan.push(minus1.hourly.data[i]);
            }
        }

        for (i = 0; i < forecast.hourly.data.length; i++) {
            hourlyspan.push(forecast.hourly.data[i]);
        }

        for (i = 0; i < minus2.daily.data.length; i++) {
            if(minus2.daily.data[i].time < minus1.daily.data[0].time) {
                dailyspan.push(minus2.daily.data[i]);
            }
        }

        for (i = 0; i < minus1.daily.data.length; i++) {
            if(minus1.daily.data[i].time < forecast.daily.data[0].time) {
                dailyspan.push(minus1.daily.data[i]);
            }
        }

        for (i = 0; i < forecast.daily.data.length; i++) {
            dailyspan.push(forecast.daily.data[i]);
        }

        renderData(hourlyspan, forecast.hourly.data, current, dailyspan);

    };

    /**
     * @param {object} span
     * @param {array} future
     * @param {array} current
     * @param {array} daily
     */
    var renderData = function (span, future, current, daily) {

        hide('loading');
        show('map-rain');
        show('map-lightning');
        show('suntimes');

        var owm = new OWM();

        owm.dialTemperature('dial-temperature', current);
        owm.placeIcon('icon-weather', current);

        owm.dialWind('dial-wind', future);
        owm.plotPressure('chart-pressure', span, current, daily);
        owm.plotTemperature('chart-temp', span, daily);
        //owm.plotHumidity('chart-humidity', span, daily);
        owm.plotWindSpeed('chart-wind', span, daily);
        owm.plotRain('chart-rain', span, daily);
        owm.placeDate('date', span);
        owm.placeSuntimes('suntimes', daily);

    };

    $(function() {

        var position;
        var apikey;

        setTimeout (function () {
            if(!dataReceived) {
                location.reload(true);
            }
        }, 60000);

        position = urlParam('position') || "49.1308061,10.9235329";
        apikey = urlParam('apikey') || urlParam(0);

        if(apikey) {
            $.when(
                $.ajax({
                    url: "https://api.forecast.io/forecast/" + apikey + "/" + position + "," + minus1 + "?extend=hourly&units=si&callback=?",
                    type: 'GET',
                    dataType: 'jsonp',
                    error: errorHandler
                }),
                $.ajax({
                    url: "https://api.forecast.io/forecast/" + apikey + "/" + position + "," + minus2 + "?extend=hourly&units=si&callback=?",
                    type: 'GET',
                    dataType: 'jsonp',
                    error: errorHandler
                }),
                $.ajax({
                    url: "https://api.forecast.io/forecast/" + apikey + "/" + position + "?extend=hourly&units=si&callback=?",
                    type: 'GET',
                    dataType: 'jsonp',
                    error: errorHandler
                })).done(function (a1, a2, a3) {
                mergeData(a1[0], a2[0], a3[0]);
            }).fail(function () {
                location.reload(true);
            });
        } else {
            show("apimissing");
        }

    });

}(jQuery, OWM));
