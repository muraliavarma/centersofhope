app.config(function($routeProvider) {
	$routeProvider.
	when('/home', {templateUrl: 'partials/home.html'}).
	when('/attendance', {templateUrl: 'partials/attendance.html', controller: AttendanceCtrl}).
	when('/fitness', {templateUrl: 'partials/fitness.html'}).
	when('/reading', {templateUrl: 'partials/reading.html'}).
	when('/math', {templateUrl: 'partials/math.html'}).
	otherwise({redirectTo: '/login', templateUrl: 'partials/login.html', controller: LoginCtrl});
});