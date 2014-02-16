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
    refresh();
}


//pour que la tableau s'affiche bien
$(document).ready(function(){
    var maxWidth = 0;
    $('tr td:last-child').each(function(index){
        if ($(this).width() > maxWidth) {
            maxWidth = $(this).width();
        }
    });
    $('tr td:last-child').each(function(index){$(this).width(maxWidth);});
});


