/**
 * Created by Charles on 15/02/14.
 */
var bg = chrome.extension.getBackgroundPage();

function ResourcesController($scope, $http) {
    $scope.resources = bg.ogameResources;

    function refresh(){
        $scope.resources = bg.ogameResources;
        $scope.$apply();
        (function() {setTimeout(refresh, 1000);})();
    }

    $scope.s2t=function(t){
        return parseInt(t/(7*86400))+'s ' +  parseInt((t%(7*86400))/86400)+'d '+(new Date(t%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
     }
    refresh();
}


//pour que le tableau s'affiche bien
$(document).ready(function(){
    var maxWidth = 0;
    $('tr td:last-child').each(function(index){
        if ($(this).width() > maxWidth) {
            maxWidth = $(this).width();
        }
    });
    $('tr td:last-child').each(function(index){$(this).width(maxWidth);});
});

