/*global jQuery, Highcharts */

/* Palette http://paletton.com/#uid=7310u0kwBFLjVL1pEHyFbtHGxn4 */

(function ($, HighCharts) {

    "use strict";

    /**
     * @constructor
     */
    var OWM = function () {

        /**
         * @param {string} chartName
         * @param {object} forecast
         */
        var placeIcon = function (chartName, forecast) {
            $('#' + chartName).html('<img src="img/weather/'+ translateIcon(forecast.icon) + '.png" style="width: 100%;" />');
        };

        /**
         * @param {string} chartName
         * @param {object} forecast
         */
        var placePin = function (chartName, lat, long) {
            $('.' + chartName)
                .css('top', 240 - between(47.363446, 50.526241, lat) * 240 - 28)
                .css('left', between(8.530751, 13.24, long) * 240 - 12);
        };

        /**
         * @param {string} chartName
         * @param {object} forecast
         */
        var placeDate = function (chartName, forecast) {
            var date = new Date();
            $('#' + chartName).html("Last Update: " + date.toLocaleString());
        };

        /**
         * @param {string} chartName
         * @param {object} forecast
         */
        var placeSuntimes = function (chartName, forecast) {
            var text = "";

            for (var i = 1; i < 4; i++) {
                var sunrise = new Date(forecast[i]['sunriseTime'] * 1000);
                var sunset = new Date(forecast[i]['sunsetTime'] * 1000);
                if (i === 1) {
                    text = text + "<strong>";
                }
                text = text + sunrise.toTimeString().replace(/(\d+:\d+).*/, "$1") + " - " + sunset.toTimeString().replace(/(\d+:\d+).*/, "$1") + "<br />";
                if (i === 1) {
                    text = text + "</strong>";
                }
            }

            $('#' + chartName).html(text);
        };

        /**
         * @param {number} timestamp
         */
        var isNight = function (timestamp) {
            var date = new Date(milliSeconds(fixTimezone(timestamp)));
            if (date.getHours() <= 9 || date.getHours() >= 20) {
                return true;
            } else {
                return false;
            }
        };

        /**
         * @param {array} forecast
         * @returns {array}
         */
        var stripeDays = function (forecast) {

            var stripes = [];
            var color = 'rgba(0, 0, 0, .2)';

            stripes.push({
                color: color,
                //color: 'rgba(256, 256, 256, 1)',
                //color: 'rgba(0, 0, 0, .1)',
                from: milliSeconds(fixTimezone(forecast[0].time)),
                to: milliSeconds(fixTimezone(forecast[0].sunriseTime))
            });

            for (var i = 0; i < forecast.length - 1; i++){
                stripes.push({
                    color: color,
                    //color: 'rgba(256, 256, 256, 1)',
                    //color: 'rgba(0, 0, 0, .1)',
                    from: milliSeconds(fixTimezone(forecast[i].sunsetTime)),
                    to: milliSeconds(fixTimezone(forecast[i+1].sunriseTime))
                });
            }

            return stripes;
        };

        /**
         * @param {array} forecast
         * @returns {array}
         */
        var stripeNow = function (forecast) {
                return [{
                    color: 'rgba(0, 255, 33, 0.4)',
                    width: 2,
                    value: Date.now()
                }];
        };

        /**
         * @param {float} a
         * @param {float} b
         * @param {float} f
         * @returns {float}
        */
        var between = function (a, b, f)
        {
            return (f - a) / (b - a);
        };

        /**
         * @param {string} iconCode
         * @returns {string}
        */
        var translateIcon = function (iconCode) {
            switch (iconCode) {
                case "clear-day":
                    return "sunny";
                case "clear-night":
                    return "moon";
                case "partly-cloudy-night":
                    return "cloudynight";
                case "partly-cloudy-day":
                case "wind":
                    return "mostlycloudy";
                case "cloudy":
                    return "cloudy";
                case "rain":
                    return "drizzle";
                case "snow":
                    return "snow";
                case "sleet":
                    return "drizzlesnow";
                case "fog":
                    return "haze";
                default:
                    return "sunny";
            }
        };

        /**
         * @param {double} angle
         * @returns {double}
         */
        var quantizeDirection = function (angle) {
            var val = Math.floor((angle / 22.5) + 0.5);
            return (val % 16);
        };

        /**
         * @param {double} angle
         * @returns {string}
         */
        var translateToDirection = function (angle) {
            angle = angle + 180;
            var arr = ["n","nne","ne","ene","e","ese", "se", "sse","s","ssw","sw","wsw","w","wnw","nw","nnw"];
            return arr[quantizeDirection(angle)];
        };

        /**
         * @param {number} timestamp
         * @returns {number}
         */
        var milliSeconds = function (timestamp) {
            return 1000 * timestamp;
        };

        /**
         * @param {number} timestamp
         * @returns {number}
         */
        var fixTimezone = function (timestamp) {
            return timestamp - (new Date().getTimezoneOffset() * 60);
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         */
        var dialWind = function (chartName, forecast) {

            var n = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
            var length = forecast.length;

            var tmp = [
                { name: "6+ bft", data: [], color: '#fde725'},
                { name: "5 bft", data: [], color: '#90d743'},
                { name: "4 bft", data: [], color: '#35b779'},
                { name: "3 bft", data: [], color: '#21918c'},
                { name: "2 bft", data: [], color: '#31688e'},
                { name: "1 bft", data: [], color: '#443983'},
                { name: "0 bft", data: [], color: '#440154'}
            ];

            for (var g = 0; g < 7; g++ ) {
                for (var key in n) {
                    tmp[g]['data'][key] = 0;
                }
            }

            for (var i = 0; i < length; i++) {

                var deg = forecast[i].windBearing;
                var stmp = [forecast[i].windSpeed]; // we're counting gusts, should we?

                for (var j = 0; j < stmp.length; j++) {

                    var s = stmp[j];
                    //var step = 24;
                    var l = 0;

                    l = quantizeDirection(deg);

                    if (s >= 0 && s < 0.5) {
                        tmp[6]['data'][l] += 1 - j / 2; // Gusts are half as likely, hence the substraction
                    }
                    if (s >= 0.5 && s < 2) {
                        tmp[5]['data'][l] += 1 - j / 2;
                    }
                    if (s >= 2 && s < 4) {
                        tmp[4]['data'][l] += 1 - j / 2;
                    }
                    if (s >= 4 && s < 6) {
                        tmp[3]['data'][l] += 1 - j / 2;
                    }
                    if (s >= 6 && s < 8) {
                        tmp[2]['data'][l] += 1 - j / 2;
                    }
                    if (s >= 8 && s < 11) {
                        tmp[1]['data'][l] += 1 - j / 2;
                    }
                    if (s >= 11) {
                        tmp[0]['data'][l] += 1 - j / 2;
                    }
                }
            }

            for (g = 0; g <  7; g++) {
                for(key in n) {
                    tmp[g]['data'][key] = Math.sqrt(Math.round(100 * tmp[g]['data'][key] / (length * 1.5)));
                }
            }

            new Highcharts.Chart({
                chart: {
                    backgroundColor:'rgba(255, 255, 255, 0)',
                    renderTo: chartName,
                    polar: true,
                    type: 'column',
                    marginLeft: 0,
                    marginRight: 0
                },
                pane: {
                    background: [
                        {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                stops: [
                                    [0, '#2a2a2b'],
                                    [1, '#3e3e40']
                                ]
                            }
                        }
                    ]
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Windrose'
                },
                subtitle: {
                    text: 'der nächsten Woche',
                    floating: true
                },
                legend: {
                    reversed: true,
                    align: 'right',
                    verticalAlign: 'top',
                    y: 10,
                    x: 15,
                    layout: 'vertical',
                    borderWidth: 0,
                    itemStyle: {
                        fontSize: 9
                    },
                    floating: true
                },
                tooltip: {
                    formatter: function () {
                        return this.x +': '+ this.y * this.y;
                    }
                },
                xAxis: {
                    tickmarkPlacement: 'on',
                    categories:["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
                    type: 0
                },
                yAxis: {
                    min: 0,
                    endOnTick: false,
                    showLastLabel: true,
                    showFirstLabel: false,
                    title: {
                        enabled: false
                    },
                    labels: {
                        formatter: function () {
                            return this.value * this.value + '%';
                        }
                    }
                },
                series: tmp,
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        shadow: false,
                        groupPadding: 0,
                        pointPlacement: 'on',
                        borderColor: 'transparent'
                    }
                }
            });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         */
        var dialPressure = function (chartName, forecast) {

            var tmp = [];

            tmp.push(forecast.pressure);

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'gauge',
                    alignTicks: false,
                    backgroundColor:'rgba(255, 255, 255, 0)',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    marginLeft: 0,
                    marginRight: 0
                },

                credits: {
                    enabled: false
                },

                title: {
                    text: 'Luftdruck'
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [
                        {
                            backgroundColor:'rgba(255, 255, 255, 0)'
                        }
                    ]
                },

                yAxis: [
                    {
                        min: 945,
                        max: 1055,
                        lineColor: '#339',
                        tickColor: '#339',
                        minorTickColor: '#339',
                        offset: -25,
                        lineWidth: 2,
                        labels: {
                            distance: -20,
                            rotation: 'auto'
                        },
                        tickLength: 5,
                        minorTickLength: 5,
                        endOnTick: false,
                        startOnTick: false
                    },
                    {
                        min: 950 / 1.33322,
                        max: 1100 / 1.33322,
                        tickPosition: 'outside',
                        lineColor: '#933',
                        lineWidth: 2,
                        minorTickPosition: 'outside',
                        tickColor: '#933',
                        minorTickColor: '#933',
                        tickLength: 5,
                        minorTickLength: 5,
                        labels: {
                            distance: 12,
                            rotation: 'auto'
                        },
                        offset: -18,
                        endOnTick: false
                    }
                ],

                series: [{
                    data: tmp,
                    dataLabels: {
                        formatter: function () {
                            var pa = this.y;
                            var mm = Math.round(pa / 1.33322);
                            //var inh = Math.round(pa / 33.8653);
                            return '<span style="color:#339">'+ pa + ' hPa</span><br>' +
                                '<span style="color:#933">' + mm + ' mmHg</span>';
                        },
                        backgroundColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, '#DDD'],
                                [1, '#FFF']
                            ]
                        }
                    }
                }]
            });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         */
        var dialTemperature = function (chartName, forecast) {

            var tmp = [];

            tmp.push(Math.round(forecast.temperature * 10) / 10);

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'gauge',
                    backgroundColor:'rgba(255, 255, 255, 0)',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    marginLeft: 0,
                    marginRight: 0
                },

                credits: {
                    enabled: false
                },

                title: {
                    text: null
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [
                        {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                stops: [
                                    [0, '#2a2a2b'],
                                    [1, '#3e3e40']
                                ]
                            }
                        }
                    ]
                },

                plotOptions: {
                    gauge: {
                        dial: {
                            backgroundColor: '#ffffff'
                        }
                    }
                },

                // the value axis
                yAxis: {
                    min: -10,
                    max: 40,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: '°C',
                        y: 5
                    },
                    plotBands: [{
                        from: -10,
                        to: 10,
                        color: '#FF4100' // red
                    }, {
                        from: 10,
                        to: 20,
                        color: '#FF8E00' // yellow
                    }, {
                        from: 20,
                        to: 36,
                        color: '#00CC6A' // green
                    }, {
                        from: 36,
                        to: 40,
                        color: '#FF8E00' // yellow
                    }]
                },
                series: [{
                    data: tmp
                }]
            });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         * @param {array} daily
         */
        var plotWindSpeed = function (chartName, forecast, daily) {

            var wind = [];
            var gust = [];
            var icons = [];
            //var maxv = 0;

            for (var i = 0; i < forecast.length; i++) {

                wind.push([
                        milliSeconds(fixTimezone(forecast[i].time)),
                        Math.min(forecast[i].windSpeed, forecast[i].windGust)
                    ]);

                gust.push([
                        milliSeconds(fixTimezone(forecast[i].time)),
                        Math.max(forecast[i].windSpeed, forecast[i].windGust)
                    ]);

                if (i % 3 === 0) {
                    icons.push({
                            x: milliSeconds(fixTimezone(forecast[i].time)),
                            y: -0.5,
                            marker: { symbol: 'url(img/directions/' + translateToDirection(forecast[i].windBearing) + '.png)' }
                        });
                }
            }

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'areasplinerange'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Windgeschwindigkeit'
                },
                tooltip: {
                    formatter: function () {
                        return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) + ': '+ this.y;
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        x: 48,
                        formatter: function () {
                            return Highcharts.dateFormat('%a, %e. %b', this.value);
                        }
                    },
                    plotBands: stripeDays(daily),
                    plotLines: stripeNow(forecast)
                },
                plotOptions: {
                    series: {
                        lineWidth: 3,
                        marker: {
                            enabled: false
                        }
                    }
                },
                yAxis: [{
                    title: {
                        text: 'm/s'
                    },
                    min: -1,
                    minRange: 9,
                    startOnTick: false,
                    alternateGridColor: null,
                    opposite: true,
                    gridLineWidth: 0,
                    plotLines: [{
                        value: 1.6,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 3.4,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 5.5,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 8,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 11,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 14,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 17,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 21,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 25,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 29,
                        color: '#707073',
                        width: 1
                    }, {
                        value: 23,
                        color: '#707073',
                        width: 1
                    }],
                    plotBands: [{ // Light air
                        from: 0.3,
                        to: 1.6,
                        label: {
                            x: -15,
                            text: '1',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Light breeze
                        from: 1.6,
                        to: 3.4,
                        label: {
                            x: -15,
                            text: '2',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Gentle breeze
                        from: 3.4,
                        to: 5.5,
                        label: {
                            x: -15,
                            text: '3',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Moderate breeze
                        from: 5.5,
                        to: 8,
                        label: {
                            x: -15,
                            text: '4',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Fresh breeze
                        from: 8,
                        to: 11,
                        label: {
                            x: -15,
                            text: '5',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Strong breeze
                        from: 11,
                        to: 14,
                        label: {
                            x: -15,
                            text: '6',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // High wind
                        from: 14,
                        to: 17,
                        label: {
                            x: -15,
                            text: '7',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Gale
                        from: 17,
                        to: 21,
                        label: {
                            x: -15,
                            text: '8',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Strong Gale
                        from: 21,
                        to: 25,
                        label: {
                            x: -15,
                            text: '9',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Storm
                        from: 25,
                        to: 29,
                        label: {
                            x: -15,
                            text: '10',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Violent Storm
                        from: 29,
                        to: 33,
                        label: {
                            x: -15,
                            text: '11',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }, { // Hurricane
                        from: 33,
                        label: {
                            x: -15,
                            text: '12',
                            style: {
                                color: '#E0E0E3'
                            }
                        }
                    }]
                },
                {
                    title: {
                        margin: 30,
                        text: 'bft'
                    }
                }],
                series: [

                    {
                        showInLegend: false,
                        type: 'areaspline',
                        data: gust,
                        color: '#666666',
                        fillOpacity: 0.2
                    },
                    {
                        showInLegend: false,
                        type: 'areaspline',
                        data: wind,
                        color: '#FF4100',
                        fillOpacity: 0.2
                    },
                    {
                        showInLegend: false,
                        type: 'scatter',
                        data: icons,
                        marker: {
                            enabled: true
                        },
                        lineWidth: 0
                    }
                    ]
                });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         * @param {array} daily
         */
        var plotTemperature = function (chartName, forecast, daily) {

            var tmp = [];

            for (var i = 0; i < forecast.length; i++) {
                tmp.push([
                    milliSeconds(fixTimezone(forecast[i].time)),
                    forecast[i].temperature
                ]);
            }

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Temperatur'
                },
                tooltip: {
                    formatter: function () {
                        return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
                    }
                },
                plotOptions: {
                    series: {
                        lineWidth: 3,
                        marker: {
                            enabled: false
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        x: 48,
                        formatter: function () {
                            return Highcharts.dateFormat('%a, %e. %b', this.value);
                        }
                    },
                    plotBands: stripeDays(daily),
                    plotLines: stripeNow(forecast)
                },
                yAxis: {
                    title: {
                        text: '°C'
                    }
                },
                series: [{
                        showInLegend: false,
                        type: 'areaspline',
                        fillOpacity: 0.2,
                        data: tmp,
                        color: '#0B7AC2',
                        negativeColor: '#57A1D1'
                    }]
                });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         * @param {array} daily
         */
        var plotHumidity = function (chartName, forecast, daily) {

            var tmp = [];

            for (var i = 0; i < forecast.length; i++) {
                tmp.push([
                    milliSeconds(fixTimezone(forecast[i].time)),
                    forecast[i].humidity * 100
                ]);
            }

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Luftfeuchtigkeit'
                },
                tooltip: {
                    formatter: function () {
                        return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) + ': ' + this.y + '%';
                    }
                },
                plotOptions: {
                    series: {
                        lineWidth: 3,
                        marker: {
                            enabled: false
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        x: 48,
                        formatter: function () {
                            return Highcharts.dateFormat('%a, %e. %b', this.value);
                        }
                    },
                    plotBands: stripeDays(daily),
                    plotLines: stripeNow(forecast)
                },
                yAxis: {
                    title: {
                        text: '%'
                    }
                },
                series: [{
                        showInLegend: false,
                        type: 'areaspline',
                        fillOpacity: 0.2,
                        data: tmp,
                        color: '#0F06E9',
                        negativeColor: '#0076E2'
                    }]
                });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         * @param {array} daily
         */
        var plotPressure = function (chartName, forecast, current, daily) {

            var tmp = [];
            var icons = [];
            var threshold = current.pressure;
            var minv = Math.min.apply(null, forecast.map(function(d) { return d.pressure }));

            threshold = 1015;

            for (var i = 0; i < forecast.length; i++) {
                tmp.push([
                    milliSeconds(fixTimezone(forecast[i].time)),
                    forecast[i].pressure
                ]);

                if (i % 6 === 0) {
                    icons.push({
                        x: milliSeconds(fixTimezone(forecast[i].time)),
                        y: forecast[i].pressure + 3,
                        marker: {
                            symbol: 'url(img/weather/tiny/'+ translateIcon(forecast[i].icon) + '.png)'
                        }
                    });
                }
            }

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Luftdruck'
                },
                tooltip: {
                    formatter: function () {
                        return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        x: 48,
                        formatter: function () {
                            return Highcharts.dateFormat('%a, %e. %b', this.value);
                        }
                    },
                    plotBands: stripeDays(daily),
                    plotLines: stripeNow(forecast)
                },
                yAxis: {
                    title: {
                        text: 'hPa'
                    },
                    labels: {
                        //align: 'left',
                        x: 0,
                        y: 5
                    },
                    minRange: 20
                },
                plotOptions: {
                    series: {
                        lineWidth: 3,
                        threshold: threshold,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        showInLegend: false,
                        type: 'areaspline',
                        fillOpacity: 0.2,
                        data: tmp,
                        color: '#00CC6A',
                        negativeColor: '#008042'
                    },
                    {
                        showInLegend: false,
                        type: 'scatter',
                        data: icons,
                        marker: {
                            enabled: true
                        },
                        lineWidth: 0
                    }
                ]
                });
        };

        /**
         * @param {string} chartName
         * @param {array} forecast
         * @param {array} daily
         */
        var plotRain = function (chartName, forecast, daily) {

            var tmp = [];
            var cloud = [];

            for (var i = 0; i < forecast.length; i++) {

                if (typeof forecast[i].precipIntensity != 'undefined') {
                    if(forecast[i].precipType == "snow") {
                        tmp.push({
                            x: milliSeconds(fixTimezone(forecast[i].time)),
                            y: forecast[i].precipIntensity,
                            color: '#ffffff'
                        });
                    } else if(forecast[i].precipType == "sleet" || forecast[i].precipType == "hail") {
                        tmp.push({
                            x: milliSeconds(fixTimezone(forecast[i].time)),
                            y: forecast[i].precipIntensity,
                            color: '#57A1D1'
                        });
                    } else {
                        tmp.push([
                            milliSeconds(fixTimezone(forecast[i].time)),
                            forecast[i].precipIntensity
                        ]);
                    }
                } else {
                    tmp.push([
                        milliSeconds(fixTimezone(forecast[i].time)), 0
                    ]);
                }

                if (typeof forecast[i].cloudCover != 'undefined') {
                    cloud.push([
                            milliSeconds(fixTimezone(forecast[i].time)),
                            Math.floor(forecast[i].cloudCover * 100)
                        ]);
                } else {
                    cloud.push([
                            milliSeconds(fixTimezone(forecast[i].time)),
                            Math.floor(0)
                        ]);
                }
            }

            new Highcharts.Chart({
                chart: {
                    renderTo: chartName,
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Niederschlag/Bewölkung'
                },
                tooltip: {
                    formatter: function () {
                        return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        x: 48,
                        formatter: function () {
                            return Highcharts.dateFormat('%a, %e. %b', this.value);
                        }
                    },
                    plotBands: stripeDays(daily),
                    plotLines: stripeNow(forecast)
                },
                yAxis: [
                    {
                        min: 0,
                        minRange: 3,
                        title: {
                            text: 'mm/h'
                        }
                    },
                    {
                        min: 0,
                        title: {
                            text: '%'
                        },
                        opposite: true
                    }
                ],
                plotOptions: {
                    series: {
                        lineWidth: 3,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        showInLegend: false,
                        type: 'areaspline',
                        yAxis: 1,
                        data: cloud,
                        color: '#FF8E00',
                        fillOpacity: 0.2
                    },
                    {
                        showInLegend: false,
                        type: 'column',
                        pointWidth: 4,
                        yAxis: 0,
                        data: tmp,
                        color: '#0B7AC2',
                        borderColor: 'transparent'
                    }
                    ]
                });
        };

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        return {
            dialTemperature: dialTemperature,
            placeIcon: placeIcon,
            dialWind: dialWind,
            plotPressure: plotPressure,
            plotTemperature: plotTemperature,
            plotHumidity: plotHumidity,
            plotWindSpeed: plotWindSpeed,
            plotRain: plotRain,
            placeDate: placeDate,
            placeSuntimes: placeSuntimes,
            placePin: placePin
        };

    };

    window.OWM = OWM;

}(jQuery, Highcharts));
