/**
 * Created by Fabien on 17/02/14.
 */
// Variables globales pour la centralisation
var cActive = false;
var cGalaxy = 1;
var cSystem = 1;
var cPosition = 1;
var cAstre = 1;
var cType = 1;
var cNbGts = 0;
var cMetal = 0;
var cCrystal = 0;
var cDeuterium = 0;
var paramLoaded = false;

function launch(){
    // Récupération de tout le paramétrage du module de centralisation
    chrome.extension.sendRequest({method: "moduleCentralisationParams"}, function(response) {
        console.log(response.centralisationActive);
        cActive=response.centralisationActive;

        console.log(response.galaxie);
        cGalaxy=response.galaxie;

        console.log(response.systeme);
        cSystem=response.systeme;

        console.log(response.position);
        cPosition=response.position;

        console.log(response.astre);
        cAstre=response.astre;

        console.log(response.centralisationType);
        cType=response.centralisationType;

        // Si le module n'est pas activé, on sort.
        if(cActive == "true"){
            console.log("cActive >"+cActive);
            // Detection de la page pour appel au module de centralisation
            var params=extractUrlParams();

            if(params["page"] == "fleet1"){
                doWork();
            }

            // Si on est page 3, on charge les resources
            if(params["page"] == "fleet3"){
                // Positionnement des ressources a centraliser
                resourcesToSend();
            }
        }
    });
}

function doWork(){
    //Positionnement du nombre de gts necessaires
    calcNbGts();

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
    $("#continue").remove();

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
    $("#metal").val($("#resources_metal").text());
    $("#crystal").val($("#resources_crystal").text());
    $("#deuterium").val($("#resources_deuterium").text());
}

function calcNbGts(){
    console.log($("#resources_metal").text());
    cNbGts = 500;
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