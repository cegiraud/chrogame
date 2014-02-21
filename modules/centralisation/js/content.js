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

            if(params["page"] == "fleet1"){
                doWork();
            }

            if(params["page"] == "fleet2"){
                $("#continue").get(0).click();
            }

            // Si on est page 3, on charge les resources
            if(params["page"] == "fleet3"){
                // Positionnement des ressources a centraliser
                resourcesToSend();
                $("#start").get(0).click();
                //$("#start").children("span").text("Centraliser");
                //$("#button4").removeClass("on").addClass("off");
            }
        }
    });
}

function doWork(){
    //Positionnement du nombre de gts necessaires
    calcNbGts();

    //document.shipsChosen.am203.value=cNbGts;

    // Construction de l'url d'appel
    var hrefString = generateHref();

    // Creation du bouton de centralisation
    var centraliserButton = $("#continue").clone();
    centraliserButton.removeClass("off");
    centraliserButton.addClass("on");
    centraliserButton.removeAttr("onclick");
    centraliserButton.children("span").text("Centraliser");
    centraliserButton.removeAttr("href").attr("href",hrefString);

    // Insertion du bouton de centralisation dans la page
    $("#continue").after(centraliserButton);
    $(".info").text("");
    //$("#continue").remove();

}

function generateHref(){
    var url = "index.php?page=fleet2&holdingtime=1&expeditiontime=1&union2=0&holdingOrExpTime=0&speed=10&mission=3&acsValues=-";
    url = url+"&galaxy="+cGalaxy;
    url = url+"&system="+cSystem;
    url = url+"&position="+cPosition;
    if(cAstre == 1){
        url = url+"&type="+3;
    }
    else{
        url = url+"&type="+1;
    }
    url = url+"&am203="+cNbGts;
    return url;
}

function resourcesToSend(){
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

$(document).ready(launch);