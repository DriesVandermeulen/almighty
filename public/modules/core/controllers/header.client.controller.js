'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$location', '$http', '$modal', 'Authentication', 'Api',
	function($scope, $rootScope, $stateParams, $location, $http, $modal, Authentication, Api) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

        $scope.notifications = [];

        $scope.closeNotification = function(index) {
            $scope.notifications.splice(index, 1);
        };

        $scope.openNewRatingModel = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/ratings/views/models/newRating.model.client.view.html',
                controller: 'newRatingModelController',
                size: size
            });

            modalInstance.result.then(function (rating) {
                $scope.notifications.push({
                    type: 'success',
                    msg: 'New rating created!' });
                $scope.getProfile();
            }, function () {

            });
        };

        $scope.path = {
            newRating : function() {
                $location.path('/ratings/new');
            },
            myRatings : function() {
                $location.path('/users/me/ratings');
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
            $http.get('users/me/profile').success(function(response) {
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