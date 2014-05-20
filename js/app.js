var chrogameApp = angular.module('chrogameApp', []);

chrogameApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/resources', {
                templateUrl: 'modules/resources/popup-fragment.html',
                controller: 'ResourcesController'
            }). when('/calculator', {
                templateUrl: 'modules/calculator/popup-fragment.html',
                controller: 'CalculatorController'
            }).
            when('/rentabilite', {
                templateUrl: 'modules/rentabilite/popup-fragment.html',
                controller: 'RentabiliteController'
            }).
            when('/centralisation', {
                templateUrl: 'modules/centralisation/popup-fragment.html',
                controller: 'CentralisationController'
            }).
            when('/ghost', {
                templateUrl: 'modules/ghost/popup-fragment.html',
                controller: 'GhostController'
            }).
            otherwise({
                redirectTo: '/resources'
            });
    }]);

