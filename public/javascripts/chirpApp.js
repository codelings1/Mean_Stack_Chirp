var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
	$rootScope.authenticated = false;
	$rootScope.current_user = "";
	
	$rootScope.signout = function(){
		console.log("logging Out");
    	$http.get('/auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};
});

app.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	.when('/login',{
		templateUrl: 'login.html',
		controller: 'authController'
	})
	.when('/signup',{
		templateUrl: 'register.html',
		controller: 'authController'
	});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});
app.controller('mainController', function(postService, $scope, $rootScope){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};

	$scope.post = function(){
		$scope.newPost.created_at = Date.now();
		$scope.newPost.created_by = $rootScope.current_user;
		postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
		$scope.newPost = {text : '', created_by : '', created_at : ''};
		
	});
	};
	
});

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username:'', password:''};
	$scope.error_message = ''
	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			console.log("chirpApp.js Here");
			$rootScope.authenticated = true;
			$rootScope.current_user = data.user.username;
			$location.path("/");	
		});
	};
	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			$rootScope.authenticated = true;
			$rootScope.current_user = data.user.username;
			$location.path("/");
			
		});
	};
	
});