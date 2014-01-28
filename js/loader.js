function ISODateString(d){
  function pad(n){return n<10 ? '0'+n : n}
  return d.getFullYear()+'-'
      + pad(d.getMonth()+1)+'-'
      + pad(d.getDate())+'T'
      + pad(d.getHours())+':'
      + pad(d.getMinutes())+':'
      + pad(d.getSeconds())
}

var dataReceived = false;

var date = new Date();
date.setHours(0);
date.setMilliseconds(0);
date.setMinutes(0);
date.setSeconds(0);

var minus1 = ISODateString(date)

date.setDate(date.getDate() - 1)
var minus2 = ISODateString(date)

jQuery(document).ready(function() {
    setTimeout(function () {
        if(!dataReceived) {
            location.reload(true);
        }
    }, 60000);

    $.when(
        $.ajax({
            url: "https://api.forecast.io/forecast/929a06588b68f79d5a6ed239dd55bd61/49.106389,10.987222," + minus1 + "?extend=hourly&units=si&callback=?",
            type: 'GET',
            dataType: 'jsonp',
            error: errorHandler
        }),
        $.ajax({
            url: "https://api.forecast.io/forecast/929a06588b68f79d5a6ed239dd55bd61/49.106389,10.987222," + minus2 + "?extend=hourly&units=si&callback=?",
            type: 'GET',
            dataType: 'jsonp',
            error: errorHandler
        }),
        $.ajax({
            url: "https://api.forecast.io/forecast/929a06588b68f79d5a6ed239dd55bd61/49.106389,10.987222?extend=hourly&units=si&callback=?",
            type: 'GET',
            dataType: 'jsonp',
            error: errorHandler
        })
        ).done(
            function(a1, a2, a3){
                mergeData(a1[0], a2[0], a3[0]);
        }).fail(
            function () {
                location.reload(true);
        });

        $.ajax({
            url: "./json/hostname.json",
            type: 'GET',
            dataType: 'jsonp',
            jsonp: false,
            jsonpCallback: 'hostnamecallback',
            error: errorHandler
        }).done(
            function(a1){
                placeHostname('hostname', a1.hostname)
            });
});


function mergeData(minus1, minus2, forecast)
{
    dataReceived = true;

    var hourlyspan = Array();
    for(var i = 1; i < minus2.hourly.data.length; i ++) {
        if(minus2.hourly.data[i].time < minus1.hourly.data[0].time) {
            hourlyspan.push(minus2.hourly.data[i])
        }
    }
    for(var i = 0; i < minus1.hourly.data.length; i ++) {
        if(minus1.hourly.data[i].time < forecast.hourly.data[0].time) {
            hourlyspan.push(minus1.hourly.data[i])
        }
    }
    for(var i = 0; i <  forecast.hourly.data.length; i ++) {
        hourlyspan.push(forecast.hourly.data[i])
    }

    var dailyspan = Array();
    for(var i = 0; i < minus2.daily.data.length; i ++) {
        if(minus2.daily.data[i].time < minus1.daily.data[0].time) {
            dailyspan.push(minus2.daily.data[i])
        }
    }
    for(var i = 0; i < minus1.daily.data.length; i ++) {
        if(minus1.daily.data[i].time < forecast.daily.data[0].time) {
            dailyspan.push(minus1.daily.data[i])
        }
    }
    for(var i = 0; i <  forecast.daily.data.length; i ++) {
        dailyspan.push(forecast.daily.data[i])
    }

    var current = forecast.currently
    renderData(hourlyspan, forecast.hourly.data, current, dailyspan);
}

function renderData(span, future, current, daily)
{
    hide('loading');
    show('map-rain');
    show('map-lightning');

    dialTemperature('dial-temperature', current);
    placeIcon('icon-weather', current);

    dialWind('dial-wind', future);
    plotPressure('chart-pressure', span, current, daily);
    plotTemperature('chart-temp', span, daily);
    plotWindSpeed('chart-wind', span, daily);
    plotRain('chart-rain', span, daily);
    placeDate('date', span);
    placeSuntimes('suntimes', daily);
}

function  errorHandler(e)
{
    console.log(e.status +' '+e.statusText);
}