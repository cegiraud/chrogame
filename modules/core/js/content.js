/**
 * Created by Charles on 16/02/14.
 */

var planetCode;

/**
 * Méthode principale
 */
function launch(){
    var activePage = $(location).attr('href');
    var toLaunch = false;
    $.each(['overview', 'resources' ,'station' ,'research', 'shipyard', 'defense'], function (){
        if(activePage.indexOf(this) !=-1){
            return toLaunch = true;
        }
    });
    //on arrete si on est pas sur une bonne page
    if(!toLaunch) return ;

    //reccupération du code de la planete active
    planetCode = getPlanetCode();

    //initialisation si on vient de se connecter
    if(activePage.indexOf("PHPSESSID=") !=-1){
        initAllResources();
    }

    getResources();
    getFlyingResources();
    getBuildings();
    getFleets();
    getDefenses();
    getInfos();
    if(activePage.indexOf('research') != -1) {
        getResearches();
    }
}


/**
 * reccupération du code de la planete active
 * @returns {string}
 */
function getPlanetCode(){
    var selector = $("#planetList .planetlink.active, #planetList .moonlink.active");
    var planetCode = selector[0].href.substring(selector[0].href.lastIndexOf('cp=') + 3);
    return planetCode.indexOf('#') != -1 ? planetCode.substring(0, planetCode.indexOf('#')): planetCode;
}

/**
 * Methode utiitaire pour le traitement du retour des ressources json
 * @param json
 * @returns {{cristal: {quantity: *, production: (*|result.metal.production|result.cristal.production|result.deuterium.production|data.metal.production|data.cristal.production), max: (*|result.metal.max|result.cristal.max|result.deuterium.max|data.metal.max|data.cristal.max)}, metal: {quantity: *, production: (*|result.metal.production|result.cristal.production|result.deuterium.production|data.metal.production|data.cristal.production), max: (*|result.metal.max|result.cristal.max|result.deuterium.max|data.metal.max|data.cristal.max)}, deuterium: {quantity: *, production: (*|result.metal.production|result.cristal.production|result.deuterium.production|data.metal.production|data.cristal.production), max: (*|result.metal.max|result.cristal.max|result.deuterium.max|data.metal.max|data.cristal.max)}}}
 */
function transformResourcesJon(json){
    return {
        metal:{quantity:json.metal.resources.actual,production:json.metal.resources.production,max:json.metal.resources.max},
        cristal:{quantity:json.crystal.resources.actual,production:json.crystal.resources.production,max:json.crystal.resources.max},
        deuterium:{quantity:json.deuterium.resources.actual,production:json.deuterium.resources.production,max:json.deuterium.resources.max}
    };
}

/**
 * Innitialise toutes les resources
 */
function initAllResources(){
    var results = {};
    $("#planetList .planetlink, #planetList .moonlink").each(function(index, elt){
        var planetCode = elt.href.substr(elt.href.lastIndexOf('cp=') +3);
        var url = $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=fetchResources';
        $.ajax({
            url: url,
            dataType: 'json',
            data: {cp:planetCode},
            success: function(json){
                sendDatas("resources", transformResourcesJon(json), planetCode);
            }
        });
    });
    //on repositionne la planete
    $.ajax({url: $("#planetList .planetlink.active, #planetList .moonlink.active")[0].href});
}

/**
 * Réccupére et envoi l'objet resource
 */
function getResources(){
    var json;
    $("script").each(function(key,value){
        var indexBegin = value.innerText.indexOf("reloadResources({");
        var indexEnd = value.innerText.indexOf("});" +1 );
        if(indexBegin != -1){
            json = value.innerText.substring(indexBegin + "reloadResources(".length);
            json= JSON.parse(json.substring(0, json.indexOf("})") +1 ));
            sendDatas("resources", transformResourcesJon(json), planetCode);
            return false;
        }
    });
}


/**
 * Teste si des flottes perso sont en vol
 */
function isFriendlyFleetFlying(){
    var nbFriendlyFleet = ($("#eventFriendly").text());
    return nbFriendlyFleet != undefined && nbFriendlyFleet != 0;
}

/**
 * Réccupère les ressources des flottes en vol
 */
function getFlyingResources(){
    //Si pas de flotte on ne fait pas l'appel ajax
    if(!isFriendlyFleetFlying()) return;

    var flyingResources = {metal:0,cristal:0,deuterium:0};
    $.ajax({
        url: $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=eventList',
        dataType: 'html',
        success: function(result){
            $("#eventboxContent").append($.parseHTML(result));
            $("#eventListWrap")
                .find(".eventFleet[data-mission-type='4'],.eventFleet[data-return-flight='true']")
                .find("td[class^='icon_movement']")
                .find(".tooltip.tooltipRight.tooltipClose").each(function(key,value){
                    $("#eventFooter").html(value.title);
                    flyingResources.metal += parseInt($("#eventFooter td:contains('Métal')").siblings().html().replace(/[^\d]/g,''));
                    flyingResources.cristal += parseInt($("#eventFooter td:contains('Cristal')").siblings().html().replace(/[^\d]/g,''));
                    flyingResources.deuterium += parseInt($("#eventFooter td:contains('Deutérium')").siblings().html().replace(/[^\d]/g,''));
                });
            sendDatas("flyingResources", flyingResources);
        }
    });
}

/**
 * Méthode générique pour parser les pages de batiment, structure, defense, flotte
 * @param keys le tableau de clé
 * @param type le type d'objet
 * @param planetCode le code de la planete
 */
function getMultipleDataOnPages(keys, type,planetCode){
    var result= {};
    $.each(keys, function(){
        $(this + " .tooltip").each(function(){
            var name = $(this)[0].title.replace(/[0-9\(\)\.]/g,'');
            if(name.indexOf("<") != -1){
                name = name.substring(0, name.indexOf("<"));
            }
            if (name.indexOf("développer au niveau") == -1) {
                result[name.trim()] = $(this).find(".level").clone().children().remove().end().text().trim();
            }
        });
    });
    sendDatas(type, result, planetCode);
}

/**
 * Réccupére les batiments
 */
function getBuildings(){
    getMultipleDataOnPages(['#building', '#storage', '#den', '#stationbuilding'], "buildings", planetCode);
}

/**
 * Réccupére les flottes
 */
function getFleets(){
    getMultipleDataOnPages(['#military'], "military",planetCode);
}

/**
 * Réccupére les défenses
 */
function getDefenses(){
    getMultipleDataOnPages(['#defensebuilding'], "defensebuilding",planetCode);
}

/**
 * Réccupére les défenses
 */
function getResearches(){
    getMultipleDataOnPages(['#base1','#base2','#base3','#base4'], "recherche");
}

/**
 * Réccupère les infos
 */
function getInfos(){
    var name = $("#header_text h2").text();
    name = name.substring(name.indexOf("-") +2);
    sendDatas("infos", {name:name}, planetCode);
}

/**
 * Envoie les données
 * @param method
 * @param data
 * @param planetCode
 */
function sendDatas(method, data, planetCode){
    chrome.extension.sendRequest({module: "core", method: method, planetCode: planetCode, data : data});
}

$(document).ready(launch);