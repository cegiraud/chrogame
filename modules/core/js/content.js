﻿/**
 * Created by Charles on 16/02/14.
 */

var planetCode;
var userId = $("meta[name='ogame-player-id']").attr("content");

/**
 * Méthode principale
 */
function launch(){
    var activePage = $(location).attr('href');
    var toLaunch = false;
    $.each(['overview', 'resources' ,'station' ,'research', 'fleet1', 'defense', 'movement'], function (){
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
    if(selector[0] == undefined){
        //si une seule planete
        selector = $("#planetList .planetlink");
    }
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
    var flyingResources = {metal:0,cristal:0,deuterium:0};

    //Si pas de flotte on ne fait pas l'appel ajax
    if(!isFriendlyFleetFlying()){
        sendDatas("flyingResources", flyingResources);
    }

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
            if (name.indexOf("développer au niveau") == -1 && name.length != 0  && name.indexOf("Rechercher ") == -1) {
                result[escapeHtml(name.trim())] = $(this).find(".level").clone().children().remove().end().text().trim();
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
    getMultipleDataOnPages(['#military','#civil'], "military",planetCode);
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
    if(name != null && name != "") {
        sendDatas("infos", {name:name}, planetCode);
    }
}

/**
 * Envoie les données
 * @param method
 * @param data
 * @param planetCode
 */
function sendDatas(method, data, planetCode){
    chrome.extension.sendRequest({user: userId, module: "core", method: method, planetCode: planetCode, data : data});
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/¢/g,"&cent;")
        .replace(/£/g,"&pound;")
        .replace(/€/g,"&euro;")
        .replace(/¥/g,"&yen;")
        .replace(/°/g,"&deg;")
        .replace(/¼/g,"&frac14;")
        .replace(/Œ/g,"&OElig;")
        .replace(/½/g,"&frac12;")
        .replace(/œ/g,"&oelig;")
        .replace(/¾/g,"&frac34;")
        .replace(/Ÿ/g,"&Yuml;")
        .replace(/¡/g,"&iexcl;")
        .replace(/«/g,"&laquo;")
        .replace(/»/g,"&raquo;")
        .replace(/¿/g,"&iquest;")
        .replace(/À/g,"&Agrave;")
        .replace(/Á/g,"&Aacute;")
        .replace(/Â/g,"&Acirc;")
        .replace(/Ã/g,"&Atilde;")
        .replace(/Ä/g,"&Auml;")
        .replace(/Å/g,"&Aring;")
        .replace(/Æ/g,"&AElig;")
        .replace(/Ç/g,"&Ccedil;")
        .replace(/È/g,"&Egrave;")
        .replace(/É/g,"&Eacute;")
        .replace(/Ê/g,"&Ecirc;")
        .replace(/Ë/g,"&Euml;")
        .replace(/Ì/g,"&Igrave;")
        .replace(/Í/g,"&Iacute;")
        .replace(/Î/g,"&Icirc;")
        .replace(/Ï/g,"&Iuml;")
        .replace(/Ð/g,"&ETH;")
        .replace(/Ñ/g,"&Ntilde;")
        .replace(/Ò/g,"&Ograve;")
        .replace(/Ó/g,"&Oacute;")
        .replace(/Ô/g,"&Ocirc;")
        .replace(/Õ/g,"&Otilde;")
        .replace(/Ö/g,"&Ouml;")
        .replace(/Ø/g,"&Oslash;")
        .replace(/Ù/g,"&Ugrave;")
        .replace(/Ú/g,"&Uacute;")
        .replace(/Û/g,"&Ucirc;")
        .replace(/Ü/g,"&Uuml;")
        .replace(/Ý/g,"&Yacute;")
        .replace(/Þ/g,"&THORN;")
        .replace(/ß/g,"&szlig;")
        .replace(/à/g,"&agrave;")
        .replace(/á/g,"&aacute;")
        .replace(/â/g,"&acirc;")
        .replace(/ã/g,"&atilde;")
        .replace(/ä/g,"&auml;")
        .replace(/å/g,"&aring;")
        .replace(/æ/g,"&aelig;")
        .replace(/ç/g,"&ccedil;")
        .replace(/è/g,"&egrave;")
        .replace(/é/g,"&eacute;")
        .replace(/ê/g,"&ecirc;")
        .replace(/ë/g,"&euml;")
        .replace(/ì/g,"&igrave;")
        .replace(/í/g,"&iacute;")
        .replace(/î/g,"&icirc;")
        .replace(/ï/g,"&iuml;")
        .replace(/ð/g,"&eth;")
        .replace(/ñ/g,"&ntilde;")
        .replace(/ò/g,"&ograve;")
        .replace(/ó/g,"&oacute;")
        .replace(/ô/g,"&ocirc;")
        .replace(/õ/g,"&otilde;")
        .replace(/ö/g,"&ouml;")
        .replace(/ø/g,"&oslash;")
        .replace(/ù/g,"&ugrave;")
        .replace(/ú/g,"&uacute;")
        .replace(/û/g,"&ucirc;")
        .replace(/ü/g,"&uuml;")
        .replace(/ý/g,"&yacute;")
        .replace(/þ/g,"&thorn;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

$(document).ready(launch);