angular.module('jtui.project')
.controller('RunCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {

    $scope.close = function(result) {
        // close, but give 500ms for bootstrap to animate
        close(result, 500);
    };

}]);
