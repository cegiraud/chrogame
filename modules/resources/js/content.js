/**
 * Created by Charles on 16/02/14.
 */

/**
 * Fonction principale
 */

var data= {
    "metal":{"quantite":0,"envol":0,"production":0,"max":0},
    "cristal":{"quantite":0,"envol":0,"production":0,"max":0},
    "deuterium":{"quantite":0,"envol":0,"production":0,"max":0}
};


function launch(){
    preventBugsOnPlanetChange();
    getFleetResources();
    getPlanetAndMonResources();
}

/**
 * Permet de corriger les bugs qui font changer de planetes
 */
function preventBugsOnPlanetChange(){
    var selector = $("#planetList .planetlink.active, #planetList .moonlink.active");
    var paramToAdd = selector[0].href.substr(selector[0].href.lastIndexOf('cp='));
    $("a").each(function(index, elt){
        if(elt.href.indexOf("cp=") == -1) {
            elt.href=elt.href + '&' + paramToAdd
        }
    });
    $.ajaxSetup({
        data: {cp: paramToAdd.substr(3)}
    });
}

/**
 * Fait les demandes Ajax pour réccupérer les ressources
 */
function getPlanetAndMonResources(){
    var planetAndMoon = $("#planetList .planetlink, #planetList .moonlink");
    var nbTotalRequetes =  planetAndMoon.length;
    var nbReponses = 0;

    var resultat = new Array();
    planetAndMoon.each(function(index, elt){
        var planetCode = elt.href.substr(elt.href.lastIndexOf('cp=') +3);
        var url = $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=fetchResources';
        $.ajax({
            url: url,
            dataType: 'json',
            data: {cp:planetCode},
            success: function(data){
                resultat.push(data);
                nbReponses++;
                if(nbReponses==nbTotalRequetes){
                    manageData(resultat);
                }
            }
        });
    });
}

/**
 * Traite le retour ajax
 * @param resultat le retour ajax
 */
function manageData(resultat){
    //on repositionne la planete
    $.ajax({url: $("#planetList .planetlink.active, #planetList .moonlink.active")[0].href});

    $.each(resultat,function(key, value){
        data.metal.quantite +=value.metal.resources.actual;
        data.metal.production +=value.metal.resources.production;
        data.metal.max +=value.metal.resources.max;

        data.cristal.quantite +=value.crystal.resources.actual;
        data.cristal.production +=value.crystal.resources.production;
        data.cristal.max +=value.crystal.resources.max;

        data.deuterium.quantite +=value.deuterium.resources.actual;
        data.deuterium.production +=value.deuterium.resources.production;
        data.deuterium.max +=value.deuterium.resources.max;
    });
    chrome.extension.sendRequest(data);
}


/**
 * Réccupère les ressources des flottes en vol
 */
function getFleetResources(){
    $.ajax({
        url: $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=eventList',
        dataType: 'html',
        success: function(result){
            $("#eventboxContent").append($.parseHTML(result));
            $("#eventListWrap")
                .find(".eventFleet[data-mission-type='4']," +
                    ".eventFleet[data-mission-type ='3'][data-return-flight='true']," +
                    ".eventFleet[data-mission-type ='8'][data-return-flight='true']")
                .find("td[class^='icon_movement']")
                .find(".tooltip.tooltipRight.tooltipClose").each(function(key,value){
                    $("#eventFooter").html(value.title);
                    data.metal.envol += parseInt($("#eventFooter td:contains('Métal')").siblings().html().replace(/[^\d]/g,''));
                    data.cristal.envol += parseInt($("#eventFooter td:contains('Cristal')").siblings().html().replace(/[^\d]/g,''));
                    data.deuterium.envol += parseInt($("#eventFooter td:contains('Deutérium')").siblings().html().replace(/[^\d]/g,''));
                });
        }
    });
}

$(document).ready(launch);