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
var cOrdre = -1;
var cModeVol = -1;

function launch(){
    // Récupération de tout le paramétrage du module de centralisation
    chrome.extension.sendRequest({method: "moduleCentralisationParams"}, function(response) {
        cActive=response.centralisationActive;
        cGalaxy=response.galaxie;
        cSystem=response.systeme;
        cPosition=response.position;
        cAstre=response.astre;
        cType=response.centralisationType;
        cOrdre=response.ordre;
        cModeVol=response.modeVol;

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

    var centraliserButton = $("<a class='on'></a>");
    centraliserButton.attr("style","margin: 0;padding: 0;height: 38px;width: 104px;float: right;position: static;display: inline;" +
        "background: transparent url('http://gf1.geo.gfsrv.net/cdn34/aaf1c61682bcced5096fa5f23fd802.png') 0 -240px;text-decoration: none;" +
        "color: #848484;-moz-outline-width: 0;outline: 0;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;cursor: auto;text-align: left;");

    var centraliserLabel = $("<span>Centraliser</span>")
    centraliserLabel.attr("style","display: block;color: #fff;text-align: center;height: 38px;line-height: 38px;" +
        "overflow: hidden;font-weight: bold;text-transform: uppercase;font-size: 12px;margin: 0;padding: 0;border: 0;outline: 0;" +
        "cursor: auto;overflow-x: hidden;overflow-y: hidden;");
    centraliserButton.append(centraliserLabel);
    centraliserButton.attr("id","centraliserButton");
    centraliserButton.bind("click",function(){
            $("#button203 div").children('a').get(0).click();
            $("#ship_203").val(cNbGts);

            setCookie("click_centraliser","true");
            $("#continue").get(0).click();
        }
    );

    // Insertion du bouton de centralisation dans la page
    $("#continue").after(centraliserButton);
}

function doFleet2JobCentralisation(paramCentraliser){
    if(getCookie("click_centraliser") == "true"){
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
    console.log("Ordre de priorité: >"+cOrdre+"<")
    console.log("Mode de vol: >"+cModeVol+"<")
    if(getCookie("click_centraliser") == "true"){
        setCookie("click_centraliser","false");

        if(cModeVol == 0){
            // On clique sur la mission transporter
            $("#missionButton3").get(0).click();
        }

        if(cModeVol == 1){
            // On clique sur la mission transporter
            $("#missionButton4").get(0).click();
        }

        // Chargement des ressources
        loadResources();

        // Envoie de la flotte
        //$("#start").get(0).click();
    }
}

function loadResources(){
    /**
     * Rappel des différentes valeurs
     * Type 0: Centraliser Tout
     * Type 1: Centraliser Metal
     * Type 2: Centraliser Cristal
     * Type 3: Centraliser Deuterium
     *
     * Ordre 0: M,C,D
     * Ordre 1: M,D,C
     * Ordre 2: C,M,D
     * Ordre 3: C,D,M
     * Ordre 4: D,M,C
     * Ordre 5: D,C,M
     */

    if(cType == 1){
        clickMax(0);
    }

    if(cType == 2){
        clickMax(1);
    }

    if(cType == 3){
        clickMax(2);
    }

    if(cType == 0){
        // 1er click
        if(cOrdre == 0 || cOrdre == 1){
            clickMax(0);
        }

        if(cOrdre == 2 || cOrdre == 3){
            clickMax(1);
        }

        if(cOrdre == 4 || cOrdre == 5){
            clickMax(2);
        }

        //2eme click
        if(cOrdre == 2 || cOrdre == 4){
            clickMax(0);
        }

        if(cOrdre == 0 || cOrdre == 5){
            clickMax(1);
        }

        if(cOrdre == 1 || cOrdre == 3){
            clickMax(2);
        }

        //3eme click
        if(cOrdre == 3 || cOrdre == 5){
            clickMax(0);
        }

        if(cOrdre == 1 || cOrdre == 4){
            clickMax(1);
        }

        if(cOrdre == 0 || cOrdre == 2){
            clickMax(2);
        }
    }
}

function clickMax(index){
    $("#resources .max").get(index).click();
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