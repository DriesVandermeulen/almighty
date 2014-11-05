'use strict';

angular.module('ratings').controller('RatingsController', ['$scope', '$http', '$stateParams', '$location','Authentication', 'Api',
    function($scope, $http, $stateParams, $location, Authentication, Api) {
        $scope.authentication = Authentication;

        $scope.error = 'No error';
        $scope.selectedType = '';

        $scope.createNewRating = function(){

            var newSubject = new Api.Subjects({
                name: $scope.name
            });

            $scope.name = '';

            newSubject.$save(function(response) {

                var newRating = new Api.Ratings({
                    type: $scope.selectedType,
                    comment:  $scope.comment,
                    subject:  response._id
                });

                $scope.type = '';
                $scope.comment = '';

                newRating.$save(function(response) {
                    $scope.error = 'success';
                    $location.path('/ratings');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(rating) {
            if (rating) {
                rating.$remove();

                for (var i in $scope.ratings) {
                    if ($scope.ratings[i] === rating) {
                        $scope.ratings.splice(i, 1);
                    }
                }
            } else {
                $scope.rating.$remove(function() {
                    $location.path('ratings');
                });
            }
        };

        $scope.update = function() {
            var rating = $scope.rating;

            rating.$update(function() {
                $location.path('ratings/' + rating._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.ratings = Api.Ratings.query();
        };

        $scope.findOne = function() {
            $scope.rating = Api.Ratings.get({
                ratingId: $stateParams.ratingId
            });

            $scope.rating.$promise.then(function (result) {
                $http.get('/subjects/' + result._id + '/ratings/count').success(function(response) {
                    result.ratings = response  ;
                });
            });
        };

        $scope.getAllSubject = function() {
            $scope.subjects = Api.Subjects.query();

            $scope.subjects.$promise.then(function (result) {
                $scope.subjects = result;
            });

        };

        $scope.setSelectedType = function(type){
            $scope.selectedType = type;
        };

    }
]);