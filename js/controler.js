/**
 * Created by Charles on 22/02/14.
 */

chrogameApp.controller('MenuController', function($scope, $location) {
    $scope.menu = "/resources";
    $scope.changeView = function(){
        $location.path($scope.menu);
    };
    $scope.changeView();
});

/**
 * Module d'affichage de resources
 */
chrogameApp.controller('ResourcesController', function($scope) {
    $scope.resources=function(){
        var ogameData = chrome.extension.getBackgroundPage().ogameData[chrome.extension.getBackgroundPage().currentUserId];
        var resources = {
            "metal":{"quantity":0,"flying":0,"production":0,"max":0},
            "cristal":{"quantity":0,"flying":0,"production":0,"max":0},
            "deuterium":{"quantity":0,"flying":0,"production":0,"max":0}
        };
        $.each(ogameData.planets, function (planetCode,planet){
            $.each(planet.resources, function (type, infos){
                $.each(infos, function (sousType, value){
                    resources[type][sousType] += value;
                })
            });
        });

        if(ogameData.flyingResources != undefined){
            $.each(ogameData.flyingResources, function (type,value){
                resources[type].flying = value;
            });
        }
        return resources;
    };

    $scope.refresh=function(){
        $scope.$apply();
        (function() {setTimeout($scope.refresh, 1000);})();
    };
    (function() {setTimeout($scope.refresh, 1000);})();
});


/**
 *  Module de calcul
 */
chrogameApp.controller('CalculatorController', function($scope) {
    $scope.isFlyingResources=true;

    $scope.resources=function(){
        var ogameData = chrome.extension.getBackgroundPage().ogameData[chrome.extension.getBackgroundPage().currentUserId];
        var resources = {
            "metal":{"quantity":0,"flying":0,"production":0,"max":0},
            "cristal":{"quantity":0,"flying":0,"production":0,"max":0},
            "deuterium":{"quantity":0,"flying":0,"production":0,"max":0}
        };
        $.each(ogameData.planets, function (planetCode,planet){
            $.each(planet.resources, function (type, infos){
                $.each(infos, function (sousType, value){
                    resources[type][sousType] += value;
                })
            });
        });

        if(ogameData.flyingResources != undefined && $scope.isFlyingResources){
            $.each(ogameData.flyingResources, function (type,value){
                resources[type].quantity += value;
            });
        }
        return resources;
    };

    $scope.refresh=function(){
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
    $scope.centralisationTypes = [
        {id:0,name:'Toutes les ressources'},
        {id:1,name:'Metal uniquement'},
        {id:2,name:'Cristal Uniquement'},
        {id:3,name:'Deuterium uniquement'}
    ];

    $scope.astres = [
        {id:0,name:'Planete'},
        {id:1,name:'Lune'}
    ];

    $scope.moduleActiveBoolean=false;
    if(localStorage["centralisation_active"] == 'true'){
        $scope.moduleActiveBoolean=true;
    }

    $scope.centralisationType=$scope.centralisationTypes[localStorage["type_centralisation"]];
    $scope.astre=$scope.astres[localStorage["astre_centralisation"]];
    $scope.galaxy=localStorage["centralisation_galaxy"];
    $scope.system=localStorage["centralisation_system"];
    $scope.position=localStorage["centralisation_position"];

    $scope.$watch('galaxy', function(newVal){
        localStorage["centralisation_galaxy"] = $scope.galaxy;
    });

    $scope.$watch('system', function(newVal){
        localStorage["centralisation_system"] = $scope.system;
    });

    $scope.$watch('position', function(newVal){
        localStorage["centralisation_position"] = $scope.position;
    });

    $scope.updateModuleActive = function(){
        localStorage["centralisation_active"] = $scope.moduleActive;
    };

    $scope.updateAstre = function(){
        localStorage["astre_centralisation"] = $scope.astre.id;
    };

    $scope.updateCentralisationType = function(){
        localStorage["type_centralisation"] = $scope.centralisationType.id;
    }
});

chrogameApp.controller('GhostController', function($scope) {
    $scope.moduleActiveBoolean=false;
    if(localStorage["ghost_active"] == 'true'){
        $scope.moduleActiveBoolean=true;
    }

    $scope.updateModuleActive = function(){
        localStorage["ghost_active"] = $scope.moduleActive;
    }
});