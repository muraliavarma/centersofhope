angular.module('app', []).
	config(function($routeProvider) {
		$routeProvider.
			when('/home', {templateUrl: 'partials/home.html'}).
			when('/attendance', {templateUrl: 'partials/attendance.html'}).
			when('/fitness', {templateUrl: 'partials/fitness.html'}).
			when('/reading', {templateUrl: 'partials/reading.html'}).
			when('/math', {templateUrl: 'partials/math.html'}).
			otherwise({redirectTo: '/login', templateUrl: 'partials/login.html'});
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