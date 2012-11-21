var app = angular.module('app', []);

//collection of all the controllers used in the application

function MainCtrl($scope, $location, $http) {
	$scope.loggedIn = (localStorage.loggedIn == 'true');
	$scope.currentPage = 'login';

	$http.get('json/pages.json').success(function (data) {
		if (!$scope.pages) {
			$scope.pages = data;
		}
	});

	$scope.setRoute = function (route, redirectURL) {

		if (route == 'login') {
			//on signout, do stuff - TODO
			$scope.loggedIn = false;
			localStorage.loggedIn = false;
			$scope.redirectURL = redirectURL;
		}

		else if (!$scope.loggedIn) {
			//if we are not logged in, then always go to the login page - TODO since setRoute() is not called on first load
			route = 'login';
		}
		$location.path(route);
		$scope.currentPage = route;

		$scope.setActivePage($scope.currentPage);

	};

	$scope.setActivePage = function (currentPage) {
		for (var i = 0; i < $scope.pages.length; i++) {
			var page = $scope.pages[i];
			if (page.id == currentPage) {
				page.class = 'active'
			}
			else {
				page.class = '';
			}
		}		
	} 
}

function LoginCtrl($scope, $http) {

	if ($scope.redirectURL) {
		$scope.invalid = true;
		$scope.message = "You need to login to access that page";
	}

	$scope.doLogin = function () {
		$http({method: 'GET', url: 'json/test/login.json'}).
		success(function(data, status, headers, config) {
			if (data.username == $scope.username && data.password == $scope.password) {
				$scope.$parent.loggedIn = true;
				localStorage.loggedIn = true;
				if ($scope.redirectURL) {
					$scope.setRoute($scope.redirectURL);
				}
				else {
					$scope.setRoute('attendance');
				}
			}
			else {
				$scope.invalid = true;
				$scope.message = "Invalid username or password";
			}
		}).
		error(function(data, status, headers, config) {
			$scope.setRoute('math');
		});
	};
}

function AttendanceCtrl($scope, $http, $routeParams, $location) {

	if (!$scope.loggedIn) {
		$scope.setRoute('login', $location.path());
		return;
	}

	$scope.setActivePage('attendance');

	$scope.getCenterChart = function() {
		$scope.isLoading = true;
		$http({method: 'GET', url: 'http://research.hsi.gatech.edu/centersofhope/attendance.php?func=centers&name=' + $scope.center}).
			success(function(data, status, headers, config) {
				$scope.isLoading = false;
				$scope.data2 = data.weeks.data;
				$scope.comboData2 = new google.visualization.arrayToDataTable([data.weeks.header].concat(data.weeks.data));
				if ($scope.data2 && $scope.data2.length) {
					$scope.selectCombo($scope.data2.length - 1, 0);	//automatically load the latest week data
				}
			}).
			error(function(data, status, headers, config) {
				console.log('error retrieving center chart data');
			});
	}

	if ($routeParams.center) {
		$scope.center = $routeParams.center;
		$scope.getCenterChart();
	}

	$scope.isLoading = true;
	$http({method: 'GET', url: 'http://research.hsi.gatech.edu/centersofhope/centers.php'}).
		success(function(data, status, headers, config) {
			$scope.isLoading = false;
			$scope.centers = data;
			if (data && data[0] && !$scope.center) {
				$scope.center = data[0];
				$scope.getCenterChart();
			}
		});

	$scope.pieHeader = [
		['string', 'Center'],
		['number', 'Enrollment']
	];


	$scope.$watch('center', function(newVal, oldVal) {
		if (newVal) {
			$location.path('attendance/' + newVal);
		}
	});

	$scope.selectCombo = function(row, column) {
		$scope.isLoading = true;
		$scope.week = $scope.data2[row][0].substr(5);

		$http({method: 'GET', url: 'http://research.hsi.gatech.edu/centersofhope/attendance.php?q=1&w=' + $scope.week}).
			success(function(data, status, headers, config) {
				$scope.isLoading = false;
				$scope.data = data.centers.data;
			 	$scope.data.sort(function (a, b) {return b[3] - a[3]})
			 	$scope.pieData = [];
				$scope.data.forEach(function(row){
					$scope.pieData.push([row[0], row[3]]);
				});
				$scope.comboData = new google.visualization.arrayToDataTable([data.centers.header].concat(data.centers.data));
			});
	}

	$scope.print = function(pane) {
		var element = document.getElementById(pane);
		var popupWin = window.open('', '_blank', 'width=' + element.offsetWidth + ', height=' + element.offsetHeight);
		popupWin.document.open();
		popupWin.document.write('<html><body onload="window.print()">' + element.innerHTML + '</html>');
		popupWin.print();
	}
}