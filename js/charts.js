//***********************************************************
//
//
//***********************************************************


function dialWind(chartName, forecast)
{
	var n = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']; 
	var length = forecast.length;

	var tmp = [
		{name:"6+ bft", data:[]},
		{name:"5 bft",data:[]}, 
		{name:"4 bft", data:[]}, 
		{name:"3 bft", data:[]}, 
		{name:"2 bft", data:[]},
		{name:"1 bft", data:[]},
		{name:"0 bft", data:[]}
	];

	for(var i in n)	for(var g = 0; g <  7; g ++) tmp[g]['data'][i] = 0;

	for(var i = 0; i < length; i ++){
		var deg = forecast[i]['wind']['deg'] 
		var stmp = [forecast[i]['wind']['speed'], forecast[i]['wind']['gust']] // we're counting gusts, should we?

		for(var j = 0; j < stmp.length; j ++) {
			var s = stmp[j];
			var step = 24;

			l = quantizeDirection(deg);

			if( s >= 0 && s < 0.5)	tmp[6]['data'][l] ++
			if( s >= 0.5 && s < 2)	tmp[5]['data'][l] ++
			if( s >= 2 && s < 4)	tmp[4]['data'][l] ++
			if( s >= 4 && s < 6)	tmp[3]['data'][l] ++
			if( s >= 6 && s < 8)	tmp[2]['data'][l] ++
			if( s >= 8 && s < 11)	tmp[1]['data'][l] ++
			if( s >= 11 )			tmp[0]['data'][l] ++
		}
	}

	var fl= forecast.length;
	for(var i in n)
		for(var g = 0; g <  7; g ++)
			tmp[g]['data'][i] = Math.round(100 * tmp[g]['data'][i] / length);

	window.chart = new Highcharts.Chart({
		chart: {
			backgroundColor:'rgba(255, 255, 255, 0)',
			renderTo: chartName,
			polar: true,
			type: 'column'
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
			formatter: function() {
				return Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y;
			}
		},
		xAxis: {
			tickmarkPlacement: 'on',
			categories:["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"], 
			type:(void 0)
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
					return this.value + '%';
				}
			}
		},
		series: tmp,
		plotOptions: {
			series: {
				stacking: 'normal',
				shadow: false,
				groupPadding: 0,
				pointPlacement: 'on'
			}
		}
	});
}

function dialPressure(chartName, forecast)
{
	var tmp = Array();
	tmp.push(forecast['main']['pressure']);
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'gauge',
			alignTicks: false,
			backgroundColor:'rgba(255, 255, 255, 0)',
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

		subtitle: {
			text: 'gemessen in Pleinfeld',
			floating: true
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


function dialTemperature(chartName, forecast)
{
	var tmp = Array();
	tmp.push(Math.round(forecast['main']['temp']*10)/10);
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: chartName,
			type: 'gauge',
			backgroundColor:'rgba(255, 255, 255, 0)',
			plotBackgroundColor: null,
			plotBackgroundImage: null,
			plotBorderWidth: 0,
			plotShadow: false
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
		},

		// the value axis
		yAxis: {
			min: 0,
			max: 45,

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
				from: 0,
				to: 10,
				color: '#DF5353' // red
			}, {
				from: 10,
				to: 20,
				color: '#DDDF0D' // yellow
			}, {
				from: 20,
				to: 45,
				color: '#55BF3B' // green
			}]
		},
		series: [{
			data: tmp,
		}]
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
			backgroundColor:'rgba(255, 255, 255, 0)',
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
		},
		yAxis: [{
			title: {
				text: 'm/s'
			},
			min: 0,
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
			}, { // Strong Gale
				from: 21,
				to: 25,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '9',
					style: {
						color: '#606060'
					}
				}
			}, { // Storm
				from: 25,
				to: 29,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '10',
					style: {
						color: '#606060'
					}
				}
			}, { // Violent Storm
				from: 29,
				to: 33,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '11',
					style: {
						color: '#606060'
					}
				}
			}, { // Hurricane
				from: 33,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '12',
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
	var icons = new Array();
	var maxv = 0;

	for(var i = 0; i <  forecast.length; i ++){
		wind.push([
				forecast[i]['dt'] * 1000 + time_zone,
				forecast[i]['wind']['speed']
			]);

		gust.push([
				forecast[i]['dt'] * 1000 + time_zone,
				forecast[i]['wind']['gust']
			]);

		icons.push({
				x: forecast[i]['dt'] * 1000 + time_zone,
				y: -1,
				marker: { symbol: 'url(img/directions/' + translateToDirection(forecast[i]['wind']['deg']) + '.png)' }
			});
	}

	chart = new Highcharts.Chart({
		chart: {
			backgroundColor:'rgba(255, 255, 255, 0)',
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

		},
		yAxis: [{
			title: {
				text: 'm/s'
			},
			min: -2,
			startOnTick: false,
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
			}, { // Strong Gale
				from: 21,
				to: 25,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '9',
					style: {
						color: '#606060'
					}
				}
			}, { // Storm
				from: 25,
				to: 29,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '10',
					style: {
						color: '#606060'
					}
				}
			}, { // Violent Storm
				from: 29,
				to: 33,
				color: 'rgba(0, 0, 0, 0.05)',
				label: {
					align: 'right',
					x: 15,
					text: '11',
					style: {
						color: '#606060'
					}
				}
			}, { // Hurricane
				from: 33,
				color: 'rgba(0, 0, 0, 0)',
				label: {
					align: 'right',
					x: 15,
					text: '12',
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
				type: 'areaspline',
				data: wind,
				color: '#EB662A',
				fillOpacity: 0.2
			},
			{
				showInLegend: false,
				type: 'spline',
				data: gust,
				color: '#C0C0C0'
			},
			{
				showInLegend: false,
				type: 'scatter',
				data: icons
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
			backgroundColor:'rgba(255, 255, 255, 0)',
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
			backgroundColor:'rgba(255, 255, 255, 0)',
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
		plotOptions: {
			series: {
				threshold: tmp[0][1]
			}
		},
		series: [{
				showInLegend: false,
				type: 'areaspline',
				fillOpacity: 0.2,
				data: tmp,
				color: '#00B000',
				negativeColor: '#B00000'
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
			backgroundColor:'rgba(255, 255, 255, 0)',
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

		},
		yAxis: [
			{
				min: 0,
				title: {
					text: 'mm/3h'
				}
			},
			{
				min: 0,
				title: {
					text: '%'
				},
				opposite: true,
			}
		],
		series: [
			{
				showInLegend: false,
				type: 'areaspline',
				yAxis: 1,
				data: cloud,
				color: '#808080',
				fillOpacity: 0.2
			},
			{
				showInLegend: false,
				type: 'column',
				pointWidth: 10,
				yAxis: 0,
				data: tmp,
				color: '#427EFF'
			}
			]
		});
}

function placeIcon(chartName, forecast)
{
	$('#' + chartName).html('<img src="img/weather/'+ translateIcon(forecast['weather'][0]['icon']) + '.png" style="width: 100%;" />');
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

function quantizeDirection(angle) {
	var val=Math.floor((angle/22.5)+.5)
	return (val % 16);
}

function translateToDirection(angle) {
	angle = angle+180;
	var arr=["n","nne","ne","ene","e","ese", "se", "sse","s","ssw","sw","wsw","w","wnw","nw","nnw"]
	return arr[quantizeDirection(angle)];
}