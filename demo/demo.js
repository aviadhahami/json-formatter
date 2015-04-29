var app = angular.module('demo', ['ngSanitize', 'jsonFormatter']);

app.controller('MainCtrl', function($scope) {
    $scope.viewType = "result dark";
    $scope.viewClass = "json-formatter-dark";



    $scope.$watch('textarea', function(str) {
        var result = {};
        try {
            $scope.complex = JSON.parse(str);
        } catch (e) {
            console.log(e);
        }
    });
});