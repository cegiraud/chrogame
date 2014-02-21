/**
 * Created by Fabien on 21/02/14.
 */
var ghostActiveParam = false;

function launch(){
    // Récupération de tout le paramétrage du module de centralisation
    chrome.extension.sendRequest({method: "moduleGhostParams"}, function(response) {
        ghostActiveParam=response.ghostActive;

        // Si le module n'est pas activé, on sort.
        if(ghostActiveParam == "true"){
            // Detection de la page pour appel au module de centralisation
            var params=extractUrlParams();

            // Page 1: On intègre le bouton centraliser avec le nombre de vaisseaux
            if(params["page"] == "fleet1"){
                doFleet1JobGhost();
            }

            // Page 2: Si on a cliqué sur centraliser, on passe à la suite
            if(params["page"] == "fleet2"){
                doFleet2JobGhost(params["ghoster"]);
            }

            // Page 3: Si on a cliqué sur centraliser, on charge les resources
            if(params["page"] == "fleet3"){
                doFleet3JobGhost();
            }
        }
    });
}

function doFleet1JobGhost(){
    // Creation du bouton de centralisation
    var ghostButton = $("#continue").clone();
    ghostButton.attr("id","ghosterButton");
    ghostButton.removeClass("off");
    ghostButton.addClass("on");
    ghostButton.removeAttr("onclick");
    ghostButton.children("span").text("Ghoster");
    ghostButton.children("span").attr("style","display: block;color: #fff;text-align: center;height: 38px;line-height: 38px;" +
        "overflow: hidden;font-weight: bold;text-transform: uppercase;font-size: 12px;margin: 0;padding: 0;border: 0;outline: 0;" +
        "cursor: auto;overflow-x: hidden;overflow-y: hidden;");
    ghostButton.attr("href","index.php?page=fleet2&ghoster=on&am203=1");
    ghostButton.attr("style","margin: 0;padding: 0;height: 38px;width: 104px;float: right;position: static;display: inline;" +
        "background: transparent url('http://gf1.geo.gfsrv.net/cdn34/aaf1c61682bcced5096fa5f23fd802.png') 0 -240px;text-decoration: none;" +
        "color: #848484;-moz-outline-width: 0;outline: 0;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;cursor: auto;text-align: left;");

    // Insertion du bouton de centralisation dans la page
    $("#continue").after(ghostButton);
}

function doFleet2JobGhost(param){
//http://s10-fr.ogame.gameforge.com/game/index.php?page=fleetcheck&ajax=1&espionage=0&galaxy=4&system=127&planet=5&type=2&recycler=1
    //galaxy=4&system=127&planet=5&type=2&recycler=1
    //http://s10-fr.ogame.gameforge.com/game/index.php?page=fleetcheck&ajax=1&espionage=0&galaxy=4&system=124&planet=7&type=2&recycler=1
}

function doFleet3JobGhost(){

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