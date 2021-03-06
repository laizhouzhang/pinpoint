(function() {
	'use strict';

	pinpointApp.constant( "CPULoadChartDaoServiceConfig", {
		dateFormat: "YYYY-MM-DD HH:mm:ss"
	});

	pinpointApp.service( "CPULoadChartDaoService", [ "CPULoadChartDaoServiceConfig",
		function CPULoadChartDaoService( cfg ) {

			this.parseData = function( aChartData ) {
				var aX = aChartData.charts.x;
				var pointsJvmCpuLoad = aChartData.charts.y["CPU_LOAD_JVM"];
				var pointsSystemCpuLoad = aChartData.charts.y["CPU_LOAD_SYSTEM"];
				var xLen = aX.length;
				var jvmCpuLen = pointsJvmCpuLoad.length;
				var systemCpuLen = pointsSystemCpuLoad.length;

				var refinedChartData = {
					data: [],
					empty: false,
					forceMax: true,
					defaultMax: 100
				};

				if ( jvmCpuLen.length === 0 && systemCpuLen.length === 0 ) {
					refinedChartData.empty = true;
				}
				for (var i = 0; i < xLen; ++i) {
					refinedChartData.data.push({
						time: moment(aX[i]).format( cfg.dateFormat ),
						jvmCpuLoad: jvmCpuLen > i ? pointsJvmCpuLoad[i][1].toFixed(2) : -1,
						systemCpuLoad: systemCpuLen > i ? pointsSystemCpuLoad[i][1].toFixed(2) : -1
					});
				}
				return refinedChartData;
			};
			this.getChartOptions = function( oChartData ) {
				return {
					"type": "serial",
					"theme": "light",
					"autoMargins": false,
					"marginTop": 10,
					"marginLeft": 70,
					"marginRight": 70,
					"marginBottom": 40,
					"legend": {
						"useGraphSettings": true,
						"autoMargins": true,
						"align" : "right",
						"position": "top",
						"valueWidth": 70,
						"markerSize": 10,
						"valueAlign": "left"
					},
					"usePrefixes": true,
					"dataProvider": oChartData.data,
					"valueAxes": [
						{
							"id": "v1",
							"gridAlpha": 0,
							"axisAlpha": 1,
							"position": "left",
							"title": "Cpu Usage (%)",
							"maximum" : 100,
							"minimum" : 0,
							"labelFunction": function(value) {
								return value + "%";
							}
						}
					],
					"graphs": [
						{
							"valueAxis": "v1",
							"balloonText": "[[value]]%",
							"legendValueText": "[[value]]%",
							"lineColor": "rgb(31, 119, 180)",
							"fillColor": "rgb(31, 119, 180)",
							"title": "JVM",
							"valueField": "jvmCpuLoad",
							"fillAlphas": 0.4,
							"connect": false
						},
						{
							"valueAxis": "v1",
							"balloonText": "[[value]]%",
							"legendValueText": "[[value]]%",
							"lineColor": "rgb(174, 199, 232)",
							"fillColor": "rgb(174, 199, 232)",
							"title": "System",
							"valueField": "systemCpuLoad",
							"fillAlphas": 0.4,
							"connect": false
						},
						{
							"valueAxis": "v1",
							"showBalloon": false,
							"lineColor": "#FF6600",
							"title": "Max",
							"valueField": "maxCpuLoad",
							"fillAlphas": 0,
							"visibleInLegend": false
						}
					],
					"categoryField": "time",
					"categoryAxis": {
						"axisColor": "#DADADA",
						"startOnAxis": true,
						"gridPosition": "start",
						"labelFunction": function (valueText) {
							return valueText.replace(/\s/, "<br>").replace(/-/g, ".").substring(2);
						}
					},
					"chartCursor": {
						"categoryBalloonAlpha": 0.7,
						"fullWidth": true,
						"cursorAlpha": 0.1
					}
				};
			};
		}
	]);
})();
