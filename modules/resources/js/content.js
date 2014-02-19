/**
 * Created by Charles on 16/02/14.
 */

/**
 * Fonction principale
 */
function launch(){
    preventBugsOnPlanetChange();
    getAjaxResources()
}

/**
 * Permet de corriger les bugs qui font changer de planetes
 */
function preventBugsOnPlanetChange(){
    var paramToAdd = $(".planetlink.active")[0].href.substr($(".planetlink.active")[0].href.lastIndexOf('cp='));
    $("a").each(function(index, elt){
        elt.href=elt.href.replace('?', '?' + paramToAdd + '&');
    });
    $.ajaxSetup({
        data: { cp: paramToAdd.substr(3)}
    });
}

/**
 * Fait les demandes Ajax pour réccupérer les ressources
 */
function getAjaxResources(){
    var planetes = $("div[id^='planet-']");
    var nbTotalRequetes =  planetes.length;
    var nbReponses = 0;

    var resultat = new Array();
    planetes.each(function(index, elt){
        var url = $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=fetchResources&cp=' + elt.id.substring(elt.id.indexOf("-")+1);
        $.ajax({
            url: url,
            dataType: 'json',
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
     var data= {
        "metal":{"quantite":0,"production":0,"max":0},
        "cristal":{"quantite":0,"production":0,"max":0},
        "deuterium":{"quantite":0,"production":0,"max":0}
    };

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

$(document).ready(launch);