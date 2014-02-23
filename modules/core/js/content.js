/**
 * Created by Charles on 16/02/14.
 */

var planetCode;

/**
 * Méthode principale
 */
function launch(){
    //reccupération du code de la planete active
    planetCode = getPlanetCode();

    //initialisation si on vient de se connecter
    if($(location).attr('href').indexOf("PHPSESSID=") !=-1){
        initAllResources();
    }
    getResources();
    getFlyingResources();
    getBuildings();
    getInfos();
}

/**
 * reccupération du code de la planete active
 * @returns {string}
 */
function getPlanetCode(){
    var selector = $("#planetList .planetlink.active, #planetList .moonlink.active");
    return selector[0].href.substr(selector[0].href.lastIndexOf('cp=') + 3);
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
 * Réccupère les ressources des flottes en vol
 */
function getFlyingResources(){
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
 * Réccupére les batiments
 */
function getBuildings(){
    var buildings= {};
    $.each(['#building', '#storage', '#den', '#stationbuilding'], function(){
        $(this + " .tooltip").each(function(){
            var name = $(this)[0].title.replace(/[0-9\(\)]/g,'');
            if(name.indexOf("<") != -1){
                name = name.substring(0, name.indexOf("<"));
            }
            if (name.indexOf("développer au niveau") == -1) {
                buildings[name.trim()] = $(this).find(".level").clone().children().remove().end().text().trim();
            }
        });
    });
    sendDatas("buildings", buildings, planetCode);
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