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

/**
 * Module d'outils divers
 */
chrogameApp.controller('RentabiliteController', function($scope) {
    var ogameData = chrome.extension.getBackgroundPage().ogameData[chrome.extension.getBackgroundPage().currentUserId];

    $scope.rentaPlusUnePlanete = {couts : {metal:0,cristal:0,deuterium:0}, gain : {metal:0,cristal:0,deuterium:0}};
    $scope.rentaPlusUnPlasma = {couts : {metal:0,cristal:0,deuterium:0}, gain : {metal:0,cristal:0,deuterium:0}};
    $scope.rentaPlusUnMetal = {couts : {metal:0,cristal:0,deuterium:0}, gain : {metal:0,cristal:0,deuterium:0}};
    $scope.rentaPlusUnCristal = {couts : {metal:0,cristal:0,deuterium:0}, gain : {metal:0,cristal:0,deuterium:0}};
    $scope.rentaPlusUnCristalMetal = {couts : {metal:0,cristal:0,deuterium:0}, gain : {metal:0,cristal:0,deuterium:0}};

    function init(){
        rentaPlusUnePlanete();
        rentaPlusUnPlasma();
        rentaPlusUnMetal();
        rentaPlusUnCristal();
        rentaPlusUnCristalMetal();
    }

    function rentaPlusUnePlanete() {
        //COUT
        var nbPlanets = 0;
        var couts = {metal:0,cristal:0,deuterium:0};
        $.each(ogameData.planets, function (planetCode,planet){
            if(planet.resources.metal.production == 0) return;
            var coutPlanet = calculResource(planet);
            couts.metal += coutPlanet.metal;
            couts.cristal += coutPlanet.cristal;
            couts.deuterium += coutPlanet.deuterium;
            nbPlanets++;
        });
        $scope.rentaPlusUnePlanete.couts.metal = couts.metal/nbPlanets;
        $scope.rentaPlusUnePlanete.couts.cristal = couts.cristal/nbPlanets;
        $scope.rentaPlusUnePlanete.couts.deuterium = couts.deuterium/nbPlanets;

        //ajout cout astro
        $scope.rentaPlusUnePlanete.couts.metal += 4000*Math.pow(1.75,ogameData.recherche['Astrophysique'])
            + parseFloat(ogameData.recherche['Astrophysique'] % 2 != 0 ? 4000*Math.pow(1.75,parseFloat(ogameData.recherche['Astrophysique']) +1 ) : 0);
        $scope.rentaPlusUnePlanete.couts.cristal += 8000*Math.pow(1.75,ogameData.recherche['Astrophysique'])
            + (ogameData.recherche['Astrophysique'] % 2 != 0 ? 8000*Math.pow(1.75,parseFloat(ogameData.recherche['Astrophysique']) +1 ) : 0);
        $scope.rentaPlusUnePlanete.couts.deuterium += 4000*Math.pow(1.75,ogameData.recherche['Astrophysique'])
            + (ogameData.recherche['Astrophysique'] % 2 != 0 ? 4000*Math.pow(1.75,parseFloat(ogameData.recherche['Astrophysique']) +1 ) : 0);


        //GAIN
        $.each(ogameData.planets, function (planetCode,planet){
            $.each(planet.resources, function (type, infos){
                $scope.rentaPlusUnePlanete.gain[type] += infos.production * 60 * 60;
            });
        });
        $scope.rentaPlusUnePlanete.gain.metal = $scope.rentaPlusUnePlanete.gain.metal / nbPlanets;
        $scope.rentaPlusUnePlanete.gain.cristal = $scope.rentaPlusUnePlanete.gain.cristal / nbPlanets;
        $scope.rentaPlusUnePlanete.gain.deuterium = $scope.rentaPlusUnePlanete.gain.deuterium / nbPlanets;

    }
    function calculResource(planet){
        var couts = {metal:0,cristal:0,deuterium:0};

        couts.metal =
            60          * (1 - Math.pow(1.5,planet.buildings["Mine de m&eacute;tal"]))/(-0.5) +
            48          * (1 - Math.pow(1.6,planet.buildings["Mine de cristal"])) / (-0.6) +
            225         * (1 - Math.pow(1.5,planet.buildings["Synth&eacute;tiseur de deut&eacute;rium"])) / (-0.5) +
            75          * (1 - Math.pow(1.5,planet.buildings["Centrale &eacute;lectrique solaire"])) / (-0.5) +
            900         * (1 - Math.pow(1.8,planet.buildings["Centrale &eacute;lectrique de fusion"])) / ( -0.8 ) +
            0           *                   planet.buildings["Satellite solaire"] +
            (1000)      * - (1 - Math.pow(2,planet.buildings["Hangar de m&eacute;tal"])) +
            (1000)      * - (1 - Math.pow(2,planet.buildings["Hangar de cristal"])) +
            (1000)      * - (1 - Math.pow(2,planet.buildings["R&eacute;servoir de deut&eacute;rium"])) +
            (2645)      * - (1 - Math.pow(2,planet.buildings["Cachette de m&eacute;tal camoufl&eacute;e"])) +
            (2645)      * - (1 - Math.pow(2,planet.buildings["Cachette de cristal souterraine"])) +
            (2645)      * - (1 - Math.pow(2,planet.buildings["Cachette de deut&eacute;rium sous-marine"])) +
            (400)       * - (1 - Math.pow(2,planet.buildings["Usine de robots"])) +
            (400)       * - (1 - Math.pow(2,planet.buildings["Chantier spatial"])) +
            (200)       * - (1 - Math.pow(2,planet.buildings["Laboratoire de recherche"])) +
            (20000)     * - (1 - Math.pow(2,planet.buildings["D&eacute;p&ocirc;t de ravitaillement"])) +
            (20000)     * - (1 - Math.pow(2,planet.buildings["Silo de missiles"])) +
            (1000000)   * - (1 - Math.pow(2,planet.buildings["Usine de nanites"])) +
            (0)         * - (1 - Math.pow(2,planet.buildings["Terraformeur"])) +
            2000 *  planet.defensebuilding["Lanceur de missiles"] +
            1500 *  planet.defensebuilding["Artillerie laser l&eacute;g&egrave;re"] +
            6000 *  planet.defensebuilding["Artillerie laser lourde"] +
            20000 * planet.defensebuilding["Canon de Gauss"] +
            2000  * planet.defensebuilding["Artillerie &agrave; ions"] +
            50000 * planet.defensebuilding["Lanceur de plasma"] +
            10000 * planet.defensebuilding["Petit bouclier"] +
            50000 * planet.defensebuilding["Grand bouclier"] +
            8000  * planet.defensebuilding["Missile d`interception"] +
            12500 * planet.defensebuilding["Missile interplan&eacute;taire"] ;
        couts.metal = Math.round(couts.metal);

        couts.cristal =
            15          * (1 - Math.pow(1.5,planet.buildings["Mine de m&eacute;tal"]))/(-0.5) +
            24          * (1 - Math.pow(1.6,planet.buildings["Mine de cristal"])) / (-0.6) +
            75         * (1 - Math.pow(1.5,planet.buildings["Synth&eacute;tiseur de deut&eacute;rium"])) / (-0.5) +
            30          * (1 - Math.pow(1.5,planet.buildings["Centrale &eacute;lectrique solaire"])) / (-0.5) +
            360         * (1 - Math.pow(1.8,planet.buildings["Centrale &eacute;lectrique de fusion"])) / ( -0.8 ) +
            2000         *                   planet.buildings["Satellite solaire"] +
            (0)      * - (1 - Math.pow(2,planet.buildings["Hangar de m&eacute;tal"])) +
            (500)      * - (1 - Math.pow(2,planet.buildings["Hangar de cristal"])) +
            (1000)      * - (1 - Math.pow(2,planet.buildings["R&eacute;servoir de deut&eacute;rium"])) +
            (0)      * - (1 - Math.pow(2,planet.buildings["Cachette de m&eacute;tal camoufl&eacute;e"])) +
            (1322)      * - (1 - Math.pow(2,planet.buildings["Cachette de cristal souterraine"])) +
            (2645)      * - (1 - Math.pow(2,planet.buildings["Cachette de deut&eacute;rium sous-marine"])) +
            (120)       * - (1 - Math.pow(2,planet.buildings["Usine de robots"])) +
            (200)       * - (1 - Math.pow(2,planet.buildings["Chantier spatial"])) +
            (400)       * - (1 - Math.pow(2,planet.buildings["Laboratoire de recherche"])) +
            (40000)     * - (1 - Math.pow(2,planet.buildings["D&eacute;p&ocirc;t de ravitaillement"])) +
            (20000)     * - (1 - Math.pow(2,planet.buildings["Silo de missiles"])) +
            (500000)   * - (1 - Math.pow(2,planet.buildings["Usine de nanites"])) +
            (50000)         * - (1 - Math.pow(2,planet.buildings["Terraformeur"])) +
            0 *  planet.defensebuilding["Lanceur de missiles"] +
            500 *  planet.defensebuilding["Artillerie laser l&eacute;g&egrave;re"] +
            2000 *  planet.defensebuilding["Artillerie laser lourde"] +
            15000 * planet.defensebuilding["Canon de Gauss"] +
            6000  * planet.defensebuilding["Artillerie &agrave; ions"] +
            50000 * planet.defensebuilding["Lanceur de plasma"] +
            10000 * planet.defensebuilding["Petit bouclier"] +
            50000 * planet.defensebuilding["Grand bouclier"] +
            0  * planet.defensebuilding["Missile d`interception"] +
            2500 * planet.defensebuilding["Missile interplan&eacute;taire"] ;
        couts.cristal = Math.round(couts.cristal);

        couts.deuterium =
            0          * (1 - Math.pow(1.5,planet.buildings["Mine de m&eacute;tal"]))/(-0.5) +
            0          * (1 - Math.pow(1.6,planet.buildings["Mine de cristal"])) / (-0.6) +
            0         * (1 - Math.pow(1.5,planet.buildings["Synth&eacute;tiseur de deut&eacute;rium"])) / (-0.5) +
            0          * (1 - Math.pow(1.5,planet.buildings["Centrale &eacute;lectrique solaire"])) / (-0.5) +
            180         * (1 - Math.pow(1.8,planet.buildings["Centrale &eacute;lectrique de fusion"])) / ( -0.8 ) +
            500           *                   planet.buildings["Satellite solaire"] +
            (0)      * - (1 - Math.pow(2,planet.buildings["Hangar de m&eacute;tal"])) +
            (0)      * - (1 - Math.pow(2,planet.buildings["Hangar de cristal"])) +
            (0)      * - (1 - Math.pow(2,planet.buildings["R&eacute;servoir de deut&eacute;rium"])) +
            (0)      * - (1 - Math.pow(2,planet.buildings["Cachette de m&eacute;tal camoufl&eacute;e"])) +
            (0)      * - (1 - Math.pow(2,planet.buildings["Cachette de cristal souterraine"])) +
            (0)      * - (1 - Math.pow(2,planet.buildings["Cachette de deut&eacute;rium sous-marine"])) +
            (200)       * - (1 - Math.pow(2,planet.buildings["Usine de robots"])) +
            (100)       * - (1 - Math.pow(2,planet.buildings["Chantier spatial"])) +
            (200)       * - (1 - Math.pow(2,planet.buildings["Laboratoire de recherche"])) +
            (0)     * - (1 - Math.pow(2,planet.buildings["D&eacute;p&ocirc;t de ravitaillement"])) +
            (1000)     * - (1 - Math.pow(2,planet.buildings["Silo de missiles"])) +
            (100000)   * - (1 - Math.pow(2,planet.buildings["Usine de nanites"])) +
            (100000)         * - (1 - Math.pow(2,planet.buildings["Terraformeur"]));
            0 *  planet.defensebuilding["Lanceur de missiles"] +
            0 *  planet.defensebuilding["Artillerie laser l&eacute;g&egrave;re"] +
            0 *  planet.defensebuilding["Artillerie laser lourde"] +
            2000 * planet.defensebuilding["Canon de Gauss"] +
            0  * planet.defensebuilding["Artillerie &agrave; ions"] +
            30000 * planet.defensebuilding["Lanceur de plasma"] +
            0 * planet.defensebuilding["Petit bouclier"] +
            0 * planet.defensebuilding["Grand bouclier"] +
            2000  * planet.defensebuilding["Missile d`interception"] +
            10000 * planet.defensebuilding["Missile interplan&eacute;taire"] ;

        couts.deuterium = Math.round(couts.deuterium);



        return couts;
    }

    function rentaPlusUnPlasma() {
        //COUT plasma
        $scope.rentaPlusUnPlasma.couts.metal = 2000 * Math.pow(2,ogameData.recherche['Technologie Plasma']);
        $scope.rentaPlusUnPlasma.couts.cristal = 4000 * Math.pow(2,ogameData.recherche['Technologie Plasma']);
        $scope.rentaPlusUnPlasma.couts.deuterium = 1000 * Math.pow(2,ogameData.recherche['Technologie Plasma']);


        //GAIN plasma
        $.each(ogameData.planets, function (planetCode,planet){
            $scope.rentaPlusUnPlasma.gain.metal += ((30*planet.buildings["Mine de m&eacute;tal"]*Math.pow(1.1,planet.buildings["Mine de m&eacute;tal"])*(1+0.01*(1+parseFloat(ogameData.recherche['Technologie Plasma'])))+30)*5 -
                (30*planet.buildings["Mine de m&eacute;tal"]*Math.pow(1.1,planet.buildings["Mine de m&eacute;tal"])*(1+0.01*(ogameData.recherche['Technologie Plasma']))+30)*5);
            $scope.rentaPlusUnPlasma.gain.cristal += ((20*planet.buildings["Mine de cristal"]*Math.pow(1.1,planet.buildings["Mine de cristal"])*(1+0.0066*(1+parseFloat(ogameData.recherche['Technologie Plasma'])))+15)*5 -
                (20*planet.buildings["Mine de cristal"]*Math.pow(1.1,planet.buildings["Mine de cristal"])*(1+0.0066*(ogameData.recherche['Technologie Plasma']))+15)*5);
            return;
        });
        $scope.rentaPlusUnPlasma.gain.deuterium = 0;
    }

    function rentaPlusUnMetal() {
        var lvlMetal=9999;

        //level min metal
        $.each(ogameData.planets, function (planetCode,planet){
            if(planet.resources.metal.production == 0) return;
            if(lvlMetal> planet.buildings["Mine de m&eacute;tal"]){
                lvlMetal = parseFloat(planet.buildings["Mine de m&eacute;tal"]);
            }
        });

        //COUT mine
        $scope.rentaPlusUnMetal.couts.metal = (60 * Math.pow(1.5,lvlMetal));
        $scope.rentaPlusUnMetal.couts.cristal = (15 * Math.pow(1.5,lvlMetal));


        //GAIN mine
        $scope.rentaPlusUnMetal.gain.metal = (30*(lvlMetal +1 )*Math.pow(1.1,(lvlMetal +1 ))*(1+0.01*(ogameData.recherche['Technologie Plasma']))+30)*5 -
            (30*lvlMetal*Math.pow(1.1,lvlMetal)*(1+0.01*(ogameData.recherche['Technologie Plasma']))+30)*5;
        $scope.rentaPlusUnMetal.gain.cristal = 0
        $scope.rentaPlusUnMetal.gain.deuterium = 0;
    }

    function rentaPlusUnCristal() {
        var lvlCristal=9999;

        //level min cristal
        $.each(ogameData.planets, function (planetCode,planet){
            if(planet.resources.metal.production == 0) return;
            if(lvlCristal> planet.buildings["Mine de cristal"]){
                lvlCristal = parseFloat(planet.buildings["Mine de cristal"]);
            }
        });

        //COUT mine
        $scope.rentaPlusUnCristal.couts.metal = (48 * Math.pow(1.6,lvlCristal));
        $scope.rentaPlusUnCristal.couts.cristal = (24 * Math.pow(1.6,lvlCristal));


        //GAIN mine
        $scope.rentaPlusUnCristal.gain.metal = 0;
        $scope.rentaPlusUnCristal.gain.cristal = (20*(lvlCristal +1)*Math.pow(1.1,(lvlCristal +1))*(1+0.0066*(ogameData.recherche['Technologie Plasma']))+15)*5 -
            (20*lvlCristal*Math.pow(1.1,lvlCristal)*(1+0.0066*(ogameData.recherche['Technologie Plasma']))+15)*5;
        $scope.rentaPlusUnCristal.gain.deuterium = 0;
    }

    function rentaPlusUnCristalMetal() {
        var lvlMetal=9999;
        var lvlCristal=9999;

        //level min cristal et metal
        $.each(ogameData.planets, function (planetCode,planet){
            if(planet.resources.metal.production == 0) return;
            if(lvlMetal> planet.buildings["Mine de m&eacute;tal"]){
                lvlMetal = parseFloat(planet.buildings["Mine de m&eacute;tal"]);
            }
            if(lvlCristal> planet.buildings["Mine de cristal"]){
                lvlCristal = parseFloat(planet.buildings["Mine de cristal"]);
            }
        });

        //COUT mine
        $scope.rentaPlusUnCristalMetal.couts.metal = (60 * Math.pow(1.5,lvlMetal)) + (48 * Math.pow(1.6,lvlCristal));
        $scope.rentaPlusUnCristalMetal.couts.cristal = (15 * Math.pow(1.5,lvlMetal)) + (24 * Math.pow(1.6,lvlCristal));


        //GAIN mine
        $scope.rentaPlusUnCristalMetal.gain.metal += (30*(lvlMetal +1 )*Math.pow(1.1,(lvlMetal +1 ))*(1+0.01*(ogameData.recherche['Technologie Plasma']))+30)*5 -
            (30*lvlMetal*Math.pow(1.1,lvlMetal)*(1+0.01*(ogameData.recherche['Technologie Plasma']))+30)*5;
        $scope.rentaPlusUnCristalMetal.gain.cristal += (20*(lvlCristal +1)*Math.pow(1.1,(lvlCristal +1))*(1+0.0066*(ogameData.recherche['Technologie Plasma']))+15)*5 -
            (20*lvlCristal*Math.pow(1.1,lvlCristal)*(1+0.0066*(ogameData.recherche['Technologie Plasma']))+15)*5;
        $scope.rentaPlusUnCristalMetal.gain.deuterium = 0;
    }

    init();
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