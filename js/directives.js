
//collection of all directives used in the project

//charts

app.directive('pieChart', function() {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			var chart = new google.visualization.PieChart(element[0]);
			var columns = scope.$eval('pieHeader');
			
			var options = {
				title: attr.title,
				titleTextStyle: {fontName: 'Arial', fontSize: 21},
				chartArea: {left: 0, top: 0, height: '100%'},
				legend: {position: 'none'},
				width: parseInt(attr.width, 10),
				height: parseInt(attr.height, 10)
			};
			
			var dataMaster = new google.visualization.DataTable();
			if (columns) {
				columns.forEach(function(column) {
					dataMaster.addColumn(column[0], column[1]);
				});
			}
			
			scope.$watch('pieData', function(rows) {
				if (!rows) {
					return;
				}
				var data = dataMaster.clone();
				data.addRows(rows);
				chart.draw(data, options);
			}, true);
		}
	};
});

app.directive('comboChart', function() {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			var chart = new google.visualization.ComboChart(element[0]);
			
			var options = {
				title: attr.title,
				titleTextStyle: {fontName: 'Arial', fontSize: 21},
				legend: {position: 'top'},
				width: parseInt(attr.width, 10),
				height: parseInt(attr.height, 10),
				vAxes: [
					{title: attr.vaxis1},
					{title: attr.vaxis2}
					],
				hAxis: {title: attr.haxis, showTextEvery: 1, slantedTextAngle: 45, slantedText: true},
				seriesType: 'bars',
				series: {2: {type: "line", targetAxisIndex:1, pointSize: 2}}
			};
			
			scope.$watch(attr.rows, function(rows) {
				if (!scope[attr.model]) {
					return;
				}
				var data = scope[attr.model].clone();
				//data.addRows(rows);
				chart.draw(data, options);
			}, true);

			if (attr.interactable) {
				google.visualization.events.addListener(chart, 'select', function(e) {
					var selection = chart.getSelection();
					if (selection[0] && selection[0].row >= 0) {
						// to make sure that we did NOT click a legend
						scope.selectCombo(selection[0].row, selection[0].column);
					}
				});
			}
		}
	};
});

google.load('visualization', '1.0', {'packages':['corechart']});
