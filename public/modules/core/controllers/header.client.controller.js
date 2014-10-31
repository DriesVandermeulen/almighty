'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Api',
	function($scope, $stateParams, $location, $http, Authentication, Api) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

        $scope.getProfile = function() {
            $http.get('/users/me/profile').success(function(response) {
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


	}
]);