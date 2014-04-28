/**
 * Created by Fabien on 17/02/14.
 */
// Variables globales pour la centralisation
var cActive = false;
var cGalaxy = 1;
var cSystem = 1;
var cPosition = 1;
var cAstre = 1;
var cType = -1;
var cNbGts = 0;

function launch(){
    // Récupération de tout le paramétrage du module de centralisation
    chrome.extension.sendRequest({method: "moduleCentralisationParams"}, function(response) {
        cActive=response.centralisationActive;
        cGalaxy=response.galaxie;
        cSystem=response.systeme;
        cPosition=response.position;
        cAstre=response.astre;
        cType=response.centralisationType;

        // Si le module n'est pas activé, on sort.
        if(cActive == "true"){
            // Detection de la page pour appel au module de centralisation
            var params=extractUrlParams();

            // Page 1: On intègre le bouton centraliser avec le nombre de vaisseaux
            if(params["page"] == "fleet1"){
                doFleet1JobCentralisation();
            }

            // Page 2: Si on a cliqué sur centraliser, on passe à la suite
            if(params["page"] == "fleet2"){
                doFleet2JobCentralisation(params["centraliser"]);
            }

            // Page 3: Si on a cliqué sur centraliser, on charge les resources
            if(params["page"] == "fleet3"){
                doFleet3JobCentralisation();
            }
        }
    });
}

function doFleet1JobCentralisation(){
    //Positionnement du nombre de gts necessaires
    calcNbGts();

    // Creation du bouton de centralisation
    var centraliserButton = $("#continue").clone();
    centraliserButton.attr("id","centraliserButton");
    centraliserButton.removeClass("off");
    centraliserButton.addClass("on");
    //centraliserButton.removeAttr("onclick");
    centraliserButton.attr("onclick","window.location.href='index.php?page=fleet2&centraliser=on&am203="+cNbGts+"'");


    centraliserButton.children("span").text("Centraliser");
    centraliserButton.children("span").attr("style","display: block;color: #fff;text-align: center;height: 38px;line-height: 38px;" +
        "overflow: hidden;font-weight: bold;text-transform: uppercase;font-size: 12px;margin: 0;padding: 0;border: 0;outline: 0;" +
        "cursor: auto;overflow-x: hidden;overflow-y: hidden;");
    centraliserButton.attr("href","");
    centraliserButton.attr("style","margin: 0;padding: 0;height: 38px;width: 104px;float: right;position: static;display: inline;" +
        "background: transparent url('http://gf1.geo.gfsrv.net/cdn34/aaf1c61682bcced5096fa5f23fd802.png') 0 -240px;text-decoration: none;" +
        "color: #848484;-moz-outline-width: 0;outline: 0;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;cursor: auto;text-align: left;");

    // Insertion du bouton de centralisation dans la page
    $("#continue").after(centraliserButton);
}

function doFleet2JobCentralisation(paramCentraliser){
    if(paramCentraliser == "on"){
        $("#galaxy").val(cGalaxy);
        $("#system").val(cSystem);
        $("#position").val(cPosition);
        if(cAstre == 1){
            $("#mbutton").get(0).click();
        }
        else{
            $("#pbutton").get(0).click();
        }

        setCookie("click_centraliser","true");
        $("#continue").get(0).click();
    }
}

function doFleet3JobCentralisation(){
    if(getCookie("click_centraliser") == "true"){
        setCookie("click_centraliser","false");

        // On clique sur la mission transporter
        $("#missionButton3").get(0).click();

        // Chargement des ressources
        loadResources();

        // Envoie de la flotte
        $("#start").get(0).click();
    }
}

function loadResources(){
    if(cType == 0 || cType == 1){
        $("#metal").val($("#resources_metal").text());
    }

    if(cType == 0 || cType == 2){
        $("#crystal").val($("#resources_crystal").text());
    }

    if(cType == 0 || cType == 3){
        $("#deuterium").val($("#resources_deuterium").text());
    }
}

function calcNbGts(){

    var reg = new RegExp("[\.]","gi");

    var temp = $("#resources_metal").text();
    var metal = parseInt(temp.replace(reg,''));

    temp = $("#resources_crystal").text();
    var cristal = parseInt(temp.replace(reg,''));

    temp = $("#resources_deuterium").text();
    var deuterium = parseInt(temp.replace(reg,''));

    var total = 0;

    if(cType == 0 || cType == 1){
        total+=metal;
    }

    if(cType == 0 || cType == 2){
        total+=cristal;
    }

    if(cType == 0 || cType == 3){
        total+=deuterium;
    }

    // TODO: Ajouter la consomation des vaisseaux
    cNbGts = Math.round(total/25000)+1;
}

function extractUrlParams(){
    var t = location.search.substring(1).split('&');
    var f = [];
    for (var i=0; i<t.length; i++){
        var x = t[ i ].split('=');
        f[x[0]]=x[1];
    }
    return f;
}

function setCookie(cname,cvalue){
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

$(document).ready(launch);