angular.module('ratings').controller('newRatingModelController', ['$scope', '$rootScope', '$modalInstance', 'Api',
    function ($scope, $rootScope, $modalInstance, Api) {

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.create = function(){

            var newRating = new Api.Ratings({
                type: $scope.selectedType,
                comment:  $scope.comment,
                subjectName: $scope.name
            });

            newRating.$save(function(response) {
                $scope.selectedType = '';
                $scope.comment = '';
                $scope.name = '';
                $rootScope.$emit('ratingCreated', response);
                $modalInstance.close(response);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);