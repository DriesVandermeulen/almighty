'use strict';

angular.module('ratings').controller('RatingsController', ['$scope', '$stateParams', '$location','Authentication', 'Api',
    function($scope, $stateParams, $location, Authentication, Api) {
        $scope.authentication = Authentication;

        $scope.error = 'No error';

        $scope.createNewRating = function(){

            var newSubject = new Api.Subjects({
                name: $scope.name
            });

            $scope.name = '';

            newSubject.$save(function(response) {

                var newRating = new Api.Ratings({
                    type: $scope.type,
                    comment:  $scope.comment,
                    subject:  response._id
                });

                $scope.type = '';
                $scope.comment = '';

                newRating.$save(function(response) {
                    $scope.error = 'success';
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
        };

        $scope.getAllSubject = function() {
            $scope.subjects = Api.Subjects.query();
        };
    }
]);