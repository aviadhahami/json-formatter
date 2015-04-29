var app = angular.module('demo', ['ngSanitize', 'jsonFormatter']);

app.controller('MainCtrl', function($scope) {

    
$scope.elementAdressings = {
                    '1': 'a',
                    '2': 'b',
                    '7': 'g',
                    '16': 'p',
                    '36': 'dd',
                    '52': 'td',
                    '76': 'li',
                    '100': 'dl',
                    '111': 'ol',
                    '115': 'small',
                    '117': 'ul',
                    '136': 'h1,h2,h3',
                    '138': 'h4,h5 (,h6 - 168?)',
                    '147': 'span',
                    '148': 'tr',
                    '268': 'label',
                    '276': 'table',
                    '582': 'fieldset',
                    '610': 'body',
                    '641': 'area',
                    '873': 'img',
                    '947': 'svg',
                    '1134': 'noindex',
                    '1587': 'select',
                    '1795': 'canvas',
                    '1812': 'tbody',
                    '1827': 'center',
                    '2061': 'map',
                    '2153': 'input',
                    '2323': 'script',
                    '2345': 'iframe',
                    '2371': 'circle',
                    '2406': 'form',
                    '2414': 'noscript',
                    '2605': 'meta',
                    '2703': 'option',
                    '2722': 'button',
                    '2884': 'div',
                    '3124': 'textarea'
                };
    $scope.mainContentChanger = function(){
        $scope.mainContent = !$scope.mainContent;
    };
    $scope.mainContent = true;
    //coloring setup
    // $scope.viewType = 'result dark';
    //$scope.viewClass = 'json-formatter-dark';

    $scope.colorCheck = false;


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


    $scope.$watch('colorCheck', function(bool) {
        //console.log(bool);
        $scope.viewType = $scope.colorCheck ? 'result dark' : 'result';
        $scope.viewClass = $scope.colorCheck ? 'json-formatter-dark' : '';
    });
});