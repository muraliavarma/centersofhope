var app = angular.module('app', []);

//collection of all the controllers used in the application

function MainCtrl($scope, $location, $http) {
	$scope.loggedIn = true;
	$scope.currentPage = 'home';

	$http.get('json/pages.json').success(function (data) {
		$scope.pages = data;
	});

	$scope.setRoute = function (route) {

		if (route == 'login') {
			//on signout, do stuff - TODO
			this.loggedIn = false;
		}

		if (!$scope.loggedIn) {
			//if we are not logged in, then always go to the login page - TODO since setRoute() is not called on first load
			route = 'login';
		}
		$location.path(route);
		$scope.currentPage = route;

		for (var i = 0; i < $scope.pages.length; i++) {
			var page = $scope.pages[i];
			if (page.id == $scope.currentPage) {
				page.class = 'active'
			}
			else {
				page.class = '';
			}
		}
	};
}

function LoginCtrl($scope, $http) {

	$scope.doLogin = function () {
		$http({method: 'GET', url: 'json/test/login.json'}).
		success(function(data, status, headers, config) {
			if (data.username == $scope.username && data.password == $scope.password) {
				$scope.$parent.loggedIn = true;
				$scope.setRoute('home');
			}
			else {
				$scope.invalid = true;
				$scope.message = "Invalid username or password";
			}
		}).
		error(function(data, status, headers, config) {
			$scope.setRoute('attendance');
		});
	};
}

function AttendanceCtrl($scope, $http) {
 			
	$scope.pieHeader = [
		['string', 'Center'],
		['number', 'Enrollment']
	];

	$scope.getData = function(url) {
		$http({method: 'GET', url: url}).
		success(function(data, status, headers, config) {
		 	$scope.data = data.centers.data;
		 	$scope.pieData = [];
			$scope.data.forEach(function(row){
				$scope.pieData.push([row[0], row[3]]);
			});

			$scope.comboData = new google.visualization.arrayToDataTable([data.centers.header].concat(data.centers.data));
		});
	}

	$scope.getData('json/test/attendance2.json');

}