'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Api',
	function($scope, $stateParams, $location, $http, Authentication, Api) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

        $scope.path = {
            newRating : function() {
                $location.path('/ratings/new');
            },
            myRatings : function() {
                $location.path('/me/ratings');
            },
            ratings : function() {
                $location.path('/ratings');
            },
            home : function() {
                $location.path('/');
            }
        };

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

        $scope.getProfile = function() {
            $http.get('/me/profile').success(function(response) {
                $scope.profile = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

        if ($scope.authentication.user){
            $scope.getProfile();
        }

        $scope.newRating =function(){
            $location.path('/ratings/new');
        };

        $scope.myRatings =function(){
            $location.path('/me/ratings');
        };

	}
]);