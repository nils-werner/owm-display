//***********************************************************
//
//
//***********************************************************


function dialWind(chartName, forecast)
{
	var length = 6;
	var options = {
		xAxis:{
			categories:["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"], 
			type:(void 0)
		}, 
		series:[
			{name:"&gt; 10 m/s", data:[0, 0, 0, 0, 0, 0, 0.13, 0, 0, 0, 0, 0, 0, 0, 0.03, 0.07]}, 
			{name:"8-10 m/s",data:[0, 0, 0, 0, 0, 0, 0.39, 0.49, 0, 0, 0, 0, 0.1, 0, 0.69, 0.13]}, 
			{name:"6-8 m/s", data:[0, 0, 0, 0, 0, 0.13, 1.74, 0.53, 0, 0, 0.13, 0.3, 0.26, 0.33, 0.66, 0.23]}, 
			{name:"4-6 m/s", data:[0, 0, 0, 0, 0, 0.3, 2.14, 0.86, 0, 0, 0.49, 0.79, 1.45, 1.61, 0.76, 0.13]}, 
			{name:"2-4 m/s", data:[0.16, 0, 0.07, 0.07, 0.49, 1.55, 2.37, 1.97, 0.43, 0.26, 1.22, 1.97, 0.92, 0.99, 1.28, 1.32]},
			{name:"0.5-2 m/s", data:[1.78, 1.09, 0.82, 1.22, 2.2, 2.01, 3.06, 3.42, 4.74, 4.14, 4.01, 2.66, 1.71, 2.4, 4.28, 5]},
			{name:"&lt; 0.5 m/s", data:[1.81, 0.62, 0.82, 0.59, 0.62, 1.22, 1.61, 2.04, 2.66, 2.96, 2.53, 1.97, 1.64, 1.32, 1.58, 1.51]}
		]
	};
				
	var n = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']; 

	var tmp = [
		{name:"&gt; 10 m/s", data:[]},
		{name:"8-10 m/s",data:[]}, 
		{name:"6-8 m/s", data:[]}, 
		{name:"4-6 m/s", data:[]}, 
		{name:"2-4 m/s", data:[]},
		{name:"0.5-2 m/s", data:[]},
		{name:"&lt; 0.5 m/s", data:[]}
	];

	for(var i in n)	for(var g = 0; g <  7; g ++) tmp[g]['data'][i] = 0;

	for(var i = 0; i < length; i ++){
		var deg = forecast[i]['wind']['deg'] 
		var s = forecast[i]['wind']['speed'];
		var step = 24;

		for(var l = 0; l <  16; l ++) { 
			if( deg >= l*step && deg < (l+1)*step)	
				break;
		}

		if( s >= 0 && s < 0.5)	tmp[6]['data'][l] ++
		if( s >= 0.5 && s < 2)	tmp[5]['data'][l] ++
		if( s >= 2 && s < 4)	tmp[4]['data'][l] ++
		if( s >= 4 && s < 6)	tmp[3]['data'][l] ++
		if( s >= 6 && s < 8)	tmp[2]['data'][l] ++
		if( s >= 8 && s < 10)	tmp[1]['data'][l] ++
		if( s >= 10 )		tmp[0]['data'][l] ++
	}

	var fl= forecast.length;
	for(var i in n)
		for(var g = 0; g <  7; g ++)
			tmp[g]['data'][i] = Math.round(100 * tmp[g]['data'][i] / length);

	options = {
		xAxis:{
			categories:["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"], 
			type:(void 0)
		}, 
		series: tmp
	};

	window.chart = new Highcharts.Chart(Highcharts.merge(options, {
		chart: {
			renderTo: chartName,
			polar: true,
			type: 'column'
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Windverteilung'
		},
		legend: {
			reversed: true,
			align: 'right',
			verticalAlign: 'top',
			y: 100,
			layout: 'vertical',
			enabled: false
		},
		tooltip: {
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			tickmarkPlacement: 'on'
		},
		yAxis: {
			min: 0,
			endOnTick: false,
			showLastLabel: true,
			title: {
				enabled: false
			},
			labels: {
				formatter: function () {
					return this.value + '%';
				}
			}
		},
		plotOptions: {
			series: {
				stacking: 'normal',
				shadow: false,
				groupPadding: 0,
				pointPlacement: 'on'
			}
		}
	}));
}

function dialPressure(chartName, forecast)
{
	var tmp = Array();
	tmp.push(forecast[0]['main']['pressure']);
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'gauge',
			alignTicks: false,
			plotBackgroundColor: null,
			plotBackgroundImage: null,
			plotBorderWidth: 0,
			plotShadow: false
		},

		credits: {
			enabled: false
		},
	
		title: {
			text: 'Luftdruck'
		},
		
		pane: {
			startAngle: -150,
			endAngle: 150
		},
	
		yAxis: [
			{
				min: 950,
				max: 1100,
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
				endOnTick: false
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
		series: [
		{
			data: tmp,
			dataLabels: {
				formatter: function () {
					var pa = this.y;
					var mm = Math.round(pa / 1.33322);
					var inh = Math.round(pa / 33.8653);
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
		}
		]
	});
}

function plotWindSpeedArea(chartName, forecast)
{
	var tmp = new Array();

	for(var i = 0; i <  forecast.length; i ++){
		tmp.push([
				forecast[i]['dt'] * 1000 + time_zone,
				forecast[i]['wind']['speed'],
				forecast[i]['wind']['gust']
			]);
	}

	chart = new Highcharts.Chart({
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
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			type: 'datetime',
			tickInterval: 24 * 3600 * 1000,
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%a, %e. %b', this.value);
				}
			},
			plotLines: [{
				color: '#0000AA',
				width: 2,
				value: +new Date + time_zone,
				label: {
					text: 'Jetzt'
				}
			}]
		},
		yAxis: [{
			title: {
				text: 'm/s'
			},
			min: 0,
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			alternateGridColor: null,
			plotBands: [{ // Light air
				from: 0.3,
				to: 1.6,
				color: 'rgba(68, 170, 213, 0.1)',
				label: {
					align: 'right',
					x: -10,
					text: '1',
					style: {
						color: '#606060'
					}
				}
			}, { // Light breeze
				from: 1.6,
				to: 3.4,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: -10,
					text: '2',
					style: {
						color: '#606060'
					}
				}
			}, { // Gentle breeze
				from: 3.4,
				to: 5.5,
				color: 'rgba(68, 170, 213, 0.1)',
				label: {
					align: 'right',
					x: -10,
					text: '3',
					style: {
						color: '#606060'
					}
				}
			}, { // Moderate breeze
				from: 5.5,
				to: 8,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: -10,
					text: '4',
					style: {
						color: '#606060'
					}
				}
			}, { // Fresh breeze
				from: 8,
				to: 11,
				color: 'rgba(68, 170, 213, 0.1)',
				label: {
					align: 'right',
					x: -10,
					text: '5',
					style: {
						color: '#606060'
					}
				}
			}, { // Strong breeze
				from: 11,
				to: 14,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: -10,
					text: '6',
					style: {
						color: '#606060'
					}
				}
			}, { // High wind
				from: 14,
				to: 17,
				color: 'rgba(68, 170, 213, 0.1)',
				label: {
					align: 'right',
					x: -10,
					text: '7',
					style: {
						color: '#606060'
					}
				}
			}, { // Gale
				from: 17,
				to: 21,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: -10,
					text: '8',
					style: {
						color: '#606060'
					}
				}
			}]
		},
		{
			title: {
				margin: 20,
				text: 'bft',
			},
			opposite:true
		}
		],
		legend: {
			enabled: false
		},
		series: [{
			showInLegend: false,
			data: tmp,
			color: '#EB662A'
		}]
	});
}


function plotWindSpeed(chartName, forecast)
{
	var wind = new Array();
	var gust = new Array();

	for(var i = 0; i <  forecast.length; i ++){
		wind.push([
				forecast[i]['dt'] * 1000 + time_zone,
				forecast[i]['wind']['speed']
			]);

		gust.push([
				forecast[i]['dt'] * 1000 + time_zone,
				forecast[i]['wind']['gust']
			]);
	}

	chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'spline',
			marginRight: 60
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Windgeschwindigkeit'
		},
		tooltip: {
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			type: 'datetime',
			tickInterval: 24 * 3600 * 1000,
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%a, %e. %b', this.value);
				}
			},
			plotLines: [{
				color: '#0000AA',
				width: 2,
				value: +new Date + time_zone,
				label: {
					text: 'Jetzt'
				}
			}]
		},
		yAxis: [{
			title: {
				text: 'm/s'
			},
			min: 0,
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			alternateGridColor: null,
			plotBands: [{ // Light air
				from: 0.3,
				to: 1.6,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '1',
					style: {
						color: '#606060'
					}
				}
			}, { // Light breeze
				from: 1.6,
				to: 3.4,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '2',
					style: {
						color: '#606060'
					}
				}
			}, { // Gentle breeze
				from: 3.4,
				to: 5.5,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '3',
					style: {
						color: '#606060'
					}
				}
			}, { // Moderate breeze
				from: 5.5,
				to: 8,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '4',
					style: {
						color: '#606060'
					}
				}
			}, { // Fresh breeze
				from: 8,
				to: 11,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '5',
					style: {
						color: '#606060'
					}
				}
			}, { // Strong breeze
				from: 11,
				to: 14,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '6',
					style: {
						color: '#606060'
					}
				}
			}, { // High wind
				from: 14,
				to: 17,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '7',
					style: {
						color: '#606060'
					}
				}
			}, { // Gale
				from: 17,
				to: 21,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '8',
					style: {
						color: '#606060'
					}
				}
			}]
		},
		{
			title: {
				margin: 30,
				text: 'bft',
			},
			opposite:true
		}],
		series: [
			{
				showInLegend: false,
				type: 'spline',
				data: wind,
				color: '#EB662A'
			},
			{
				showInLegend: false,
				type: 'spline',
				data: gust,
				color: '#C0C0C0'
			}
			]
		});
}



function plotTemperature(chartName, forecast)
{
	var tmp = new Array();

	for(var i = 0; i <  forecast.length; i ++){
		tmp.push([
			forecast[i]['dt'] * 1000 + time_zone,
			forecast[i]['main']['temp']
			]);
	}

	chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'spline',
			marginRight: 60
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Temperatur'
		},
		tooltip: {
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			type: 'datetime',
			tickInterval: 24 * 3600 * 1000,
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%a, %e. %b', this.value);
				}
			},
			plotLines: [{
				color: '#0000AA',
				width: 2,
				value: +new Date + time_zone,
				label: {
					text: 'Jetzt'
				}
			}]
		},
		yAxis: {
			title: {
				text: '°C'
			}
		},
		series: [{
				showInLegend: false,
				type: 'spline',
				data: tmp,
				color: '#00A000'
			}]
		});
}

function plotPressure(chartName, forecast)
{
	var tmp = new Array();

	for(var i = 0; i <  forecast.length; i ++){
		tmp.push([
			forecast[i]['dt'] * 1000 + time_zone,
			forecast[i]['main']['pressure']
		]);
	}

	chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'spline',
			marginRight: 60
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Luftdruck'
		},
		tooltip: {
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			type: 'datetime',
			tickInterval: 24 * 3600 * 1000,
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%a, %e. %b', this.value);
				},
			},
			plotLines: [{
				color: '#0000AA',
				width: 2,
				value: +new Date + time_zone,
				label: {
					text: 'Jetzt'
				}
			}]
		},
		yAxis: {
			title: {
				text: 'hPa'
			},
			labels: {
				//align: 'left',
				x: 0,
				y: 5
			}
		},
		series: [{
				showInLegend: false,
				type: 'spline',
				data: tmp,
				color: '#B00000'
			}]
		});
}

function plotRain(chartName, forecast)
{
	var tmp = new Array();
	var cloud = new Array();

	for(var i = 0; i <  forecast.length; i ++){
		if(typeof forecast[i]['rain'] != 'undefined')
			tmp.push([
				forecast[i]['dt'] * 1000 + time_zone,
				forecast[i]['rain']['3h']
			]);
		else
			tmp.push([
				forecast[i]['dt'] * 1000 + time_zone,
				0
			]);
		cloud.push([
			forecast[i]['dt'] * 1000 + time_zone,
			forecast[i]['clouds']['all']
		]);
	}

	chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'spline'
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Regenfall/Bewölkung'
		},
		tooltip: {
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			type: 'datetime',
			tickInterval: 24 * 3600 * 1000,
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%a, %e. %b', this.value);
				}
			},
			plotLines: [{
				color: '#0000AA',
				width: 2,
				value: +new Date + time_zone,
				label: {
					text: 'Jetzt'
				}
			}]
		},
		yAxis: [
			{
				title: {
					text: 'mm/3h'
				}
			},
			{
				title: {
					text: '%'
				},
				opposite: true,
			}
		],
		series: [
			{
				showInLegend: false,
				type: 'spline',
				yAxis: 0,
				data: tmp,
				color: '#427EFF'
			},
			{
				showInLegend: false,
				type: 'spline',
				yAxis: 1,
				data: cloud,
				color: '#808080'
			}
			]
		});
}

function placeIcon(chartName, forecast)
{
	$('#' + chartName).html('<img src="img/weather/'+ translateIcon(forecast[0]['weather'][0]['icon']) + '.png" style="width: 100%;" />');
}

function translateIcon(iconCode)
{
	switch(iconCode)
	{
		case "01d":
		case "01n":
			return "sunny";
		case "02d":
		case "02n":
		case "w50": // eigentlich Windy
			return "mostlycloudy";
		case "03d":
		case "03n":
		case "04d":
		case "04n":
			return "cloudy";
		case "10d":
		case "10n":
			return "slightdrizzle";
		case "09d":
		case "09n":
		case "r":
			return "drizzle";
		case "13d":
		case "13n":
		case "sn50":
			return "snow";
		case "50d":
		case "50n":
			return "haze";
		case "11d":
		case "11n":
		case "t50":
			return "thunderstorms";
		default:
			return "sunny";
	}
}