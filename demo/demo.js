var app = angular.module('demo', ['ngSanitize', 'jsonFormatter']);

app.controller('MainCtrl', function($scope) {
    //coloring setup
    $scope.viewType = "result dark";
    $scope.viewClass = "json-formatter-dark";
    
    //textarea place holder
    $scope.taPlaceHolder = 'Place your JSON here';
    
    //message stub
    var BAD_JSON = 'Please Make sure your JSON string is valid!';
    
    //Watch function for textarea changes
    $scope.$watch('textarea', function(str) {
        var result = {};
        try {
            $scope.complex = JSON.parse(str);
            //console.log(!!JSON.parse(str));
        } catch (e) {
            // console.log(e);
            $scope.complex = BAD_JSON;
        }
    });
});