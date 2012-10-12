angular.module('app', []).
	config(function($routeProvider) {
		$routeProvider.
			when('/home', {templateUrl: 'partials/home.html'}).
			when('/attendance', {templateUrl: 'partials/attendance.html'}).
			when('/fitness', {templateUrl: 'partials/fitness.html'}).
			when('/reading', {templateUrl: 'partials/reading.html'}).
			when('/math', {templateUrl: 'partials/math.html'}).
			otherwise({redirectTo: '/login', templateUrl: 'partials/login.html', controller: LoginCtrl});
	});

function MainCtrl($scope, $location, $http) {
	$scope.loggedIn = true;
	$scope.currentPage = 'home';

	$http.get('json/pages.json').success(function (data) {
		$scope.pages = data;
	});

	$scope.setRoute = function (route) {
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
					$scope.invalid = false;
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