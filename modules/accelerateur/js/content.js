var metal = -1;
var cristal = -1;
var deuterium = -1;

var pt=1;
var gt=-1;
var recycleur = -1;
var edlm=-1;

var debug = true;

function launch(){
    recupRessourcePlanete();
    if(debug){
        console.log("Ressources de la planete");
        console.log("Metal    : "+metal);
        console.log("Cristal  : "+cristal);
        console.log("Deuterium: "+deuterium);
    }
    recupVaisseauPlanete();
    if(debug){
        console.log("Vaisseaux de la planete");
        console.log("PT        : "+pt);
        console.log("GT        : "+gt);
        console.log("Recycleur : "+recycleur);
        console.log("EDLM      : "+edlm);
    }
    accelereFleet1Page();
}

function recupRessourcePlanete(){
    console.log("Début fonction recupRessourcePlanete()");

    var reg = new RegExp("[\.]","gi");
    var temp = $("#resources_metal").text();
    metal = parseInt(temp.replace(reg,''));
    temp = $("#resources_crystal").text();
    cristal = parseInt(temp.replace(reg,''));
    temp = $("#resources_deuterium").text();
    deuterium = parseInt(temp.replace(reg,''));

    console.log("Fin fonction recupRessourcePlanete()");
}

function recupVaisseauPlanete(){
    console.log("Début fonction recupVaisseauPlanete()");

    var reg = new RegExp("[\.]","gi");
    pt = parseInt($("#button202 .level").text().substring(19).replace(reg,''));
    gt = parseInt($("#button203 .level").text().substring(19).replace(reg,''));
    recycleur = parseInt($("#button209 .level").text().substring(10).replace(reg,''));
    edlm = parseInt($("#button214 .level").text().substring(18).replace(reg,''));

    console.log("Fin fonction recupVaisseauPlanete()");
}

function accelereFleet1Page(){
    console.log("Début fonction accelereFleet1Page()");

    // Calcul du nombre de vaisseaux necessaire
    var total = metal+cristal+deuterium;
    var nbPts = Math.round(total/5000)+1;
    var nbGts = Math.round(total/25000)+1;
    var nbRecycleur = Math.round(total/20000)+1;
    var nbEdlm = Math.round(total/1000000)+1;


    // Cas des Petits transporteurs
    var spanPT = $("<span></span>");
    spanPT.attr("class","time");
    spanPT.attr("style","top:10px; width:76px; background-color: transparent; text-align:center;");

    var aPT=$("<a></a>");
    aPT.attr("style","display:inline");
    aPT.attr("onclick",'document.shipsChosen.am202.value='+nbPts+';checkIntInput("#ship_202", 0, '+pt+');checkShips("shipsChosen");return false;');

    var fontPT= $("<font></font>");
    if(nbPts > pt){
        fontPT.attr("style","color:red; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    else{
        fontPT.attr("style","color:#00FF00; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    fontPT.text(nbPts);
    aPT.append(fontPT);
    spanPT.append(aPT);
    $("#button202 .buildingimg").append(spanPT);

    // Cas des Grands transporteurs
    var spanGT = $("<span></span>");
    spanGT.attr("class","time");
    spanGT.attr("style","top:10px; width:76px; background-color: transparent; text-align:center;");

    var aGT=$("<a></a>");
    aGT.attr("style","display:inline");
    aGT.attr("onclick",'document.shipsChosen.am203.value='+nbGts+';checkIntInput("#ship_203", 0, '+gt+');checkShips("shipsChosen");return false;');

    var fontGT= $("<font></font>");
    if(nbGts > gt){
        fontGT.attr("style","color:red; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    else{
        fontGT.attr("style","color:#00FF00; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    fontGT.text(nbGts);
    aGT.append(fontGT);
    spanGT.append(aGT);
    $("#button203 .buildingimg").append(spanGT);

    // Cas des Recycleurs
    var spanRecycleurs = $("<span></span>");
    spanRecycleurs.attr("class","time");
    spanRecycleurs.attr("style","top:10px; width:76px; background-color: transparent; text-align:center;");

    var aRecycleurs=$("<a></a>");
    aRecycleurs.attr("style","display:inline");
    aRecycleurs.attr("onclick",'document.shipsChosen.am209.value='+nbRecycleur+';checkIntInput("#ship_209", 0, '+recycleur+');checkShips("shipsChosen");return false;');

    var fontRecycleurs= $("<font></font>");
    if(nbRecycleur > recycleur){
        fontRecycleurs.attr("style","color:red; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    else{
        fontRecycleurs.attr("style","color:#00FF00; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    fontRecycleurs.text(nbRecycleur);
    aRecycleurs.append(fontRecycleurs);
    spanRecycleurs.append(aRecycleurs);
    $("#button209 .buildingimg").append(spanRecycleurs);

    // Cas des EDLM
    var spanEDLM = $("<span></span>");
    spanEDLM.attr("class","time");
    spanEDLM.attr("style","top:10px; width:76px; background-color: transparent; text-align:center;");

    var aEDLM=$("<a></a>");
    aEDLM.attr("style","display:inline");
    aEDLM.attr("onclick",'document.shipsChosen.am214.value='+nbEdlm+';checkIntInput("#ship_214", 0, '+edlm+');checkShips("shipsChosen");return false;');

    var fontEDLM= $("<font></font>");
    if(nbEdlm > edlm){
        fontEDLM.attr("style","color:red; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    else{
        fontEDLM.attr("style","color:#00FF00; background-color:rgba(17, 16, 0, 0.8); padding-bottom:1px; padding-top:1px; padding-left:2px; padding-right:2px; border-radius:5px; box-shadow:0px 0px 1px 1px rgba(17, 16, 0, 0.8)");
    }
    fontEDLM.text(nbEdlm);
    aEDLM.append(fontEDLM);
    spanEDLM.append(aEDLM);
    $("#button214 .buildingimg").append(spanEDLM);
    console.log("Fin fonction accelereFleet1Page()");
}

$(document).ready(launch);