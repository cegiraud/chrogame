var chrogameApp = angular.module('chrogameApp', []);

chrogameApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/resources', {
                templateUrl: 'modules/resources/popup-fragment.html',
                controller: 'ResourcesController'
            }).
            when('/centralisation', {
                templateUrl: 'modules/centralisation/popup-fragment.html',
                controller: 'CentralisationController'
            }).
            otherwise({
                redirectTo: '/resources'
            });
    }]);

chrogameApp.controller('ResourcesController', function($scope) {
    $scope.resources = chrome.extension.getBackgroundPage().ogameResources;

    $scope.refresh=function(){
        //$scope.resources = bg.ogameResources;
        $scope.$apply();
        (function() {setTimeout($scope.refresh, 1000);})();
    };

    $scope.s2t=function(t){
        return parseInt(t/(7*86400))+'s ' +  parseInt((t%(7*86400))/86400)+'d '+(new Date(t%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
    };
    $scope.nowAddSecondes=function(t){
        return (new Date()).getTime() + t * 1000;
    };
    (function() {setTimeout($scope.refresh, 1000);})();
});

chrogameApp.controller('CentralisationController', function($scope) {
    $scope.message = 'This is Show orders screen';
});
