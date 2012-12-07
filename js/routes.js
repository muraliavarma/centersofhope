
//definition of route provider used in the navigation of different web pages

app.config(function($routeProvider) {
	$routeProvider.
		when('/attendance', {
			templateUrl: 'partials/attendance.html', controller: AttendanceCtrl
		}).
		when('/attendance/:center', {
			templateUrl: 'partials/attendance.html', controller: AttendanceCtrl
		}).
		when('/admin', {
			templateUrl: 'partials/admin.html', controller: AdminCtrl
		}).
		when('/help', {
			templateUrl: 'partials/help.html'
		}).
		otherwise({
			redirectTo: '/login', templateUrl: 'partials/login.html', controller: LoginCtrl
		});
});
