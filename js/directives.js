
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
				chartArea: {top: 0, height: '100%'},
				legend: {position: 'none'},
				width: parseInt(attr.width, 10),
				height: parseInt(attr.height, 10)
			};
			
			var dataMaster = new google.visualization.DataTable();
			columns.forEach(function(column) {
				dataMaster.addColumn(column[0], column[1]);
			});
			
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
				width: parseInt(attr.width, 10),
				height: parseInt(attr.height, 10),
				vAxis: {title: attr.vaxis},
				hAxis: {title: attr.haxis, showTextEvery: 1, slantedTextAngle: 45, slantedText: true},
				seriesType: 'bars',
				series: {2: {type: "line"}}
			};
			
			scope.$watch('data', function(rows) {
				if (!scope.comboData) {
					return;
				}
				var data = scope.comboData.clone();
				//data.addRows(rows);
				chart.draw(data, options);
			}, true);
		}
	};
});

google.load('visualization', '1.0', {'packages':['corechart']});
