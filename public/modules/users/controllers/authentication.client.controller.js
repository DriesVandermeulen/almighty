'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {

                if(validateCredential()){
                    $scope.credentials.confirmPassword = undefined;
                    $http.post('/auth/signup', $scope.credentials).success(function (response) {
                        // If successful we assign the response to the global user model
                        $scope.authentication.user = response;

                        // And redirect to the index page
                        $location.path('/');
                    }).error(function (response) {
                        $scope.error = response.message;
                    });
                }
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

        function validateCredential(){
            if(! $scope.credentials){
                $scope.error = 'Pleas fill in the required credentials.';
                return false;
            }
            else if(!$scope.credentials.username ||  $scope.credentials.username === ''){
                $scope.error = 'Pleas fill in a username.';
                return false;
            }
            else if(!$scope.credentials.email ||  $scope.credentials.email === ''){
                $scope.error = 'Pleas fill in an email address.';
                return false;
            }
            else if((!$scope.credentials.password ||  $scope.credentials.password === '') || (!$scope.credentials.confirmPassword ||  $scope.credentials.confirmPassword === '')){
                $scope.error = 'Pleas fill in a password.';
                return false;
            }
            else if( $scope.credentials.password !==  $scope.credentials.confirmPassword){
                $scope.error = 'Passwords do not match.';
                return false;
            }
            else {
                return true;
            }
        }
	}
]);