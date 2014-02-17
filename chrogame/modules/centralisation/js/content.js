/**
 * Created by Fabien on 17/02/14.
 */

function launch(){
	// Detection de la page pour appel au module de centralisation
	var params=extractUrlParams();
	if(params["page"] == "fleet1"){
		centraliser(1);
	}
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

// Variables globales pour la centralisation
var cActive;
var cGalaxie;
var cSysteme;
var cPositon;
var cType;

function centraliser(numPage){
	if(numPage == 1){
		// Récupération de tout le paramétrage du module de centralisation
		chrome.extension.sendRequest({method: "moduleCentralisationParams"}, function(response) {
			alert(response.centralisationActive);
			alert(response.galaxie);
			alert(response.systeme);
			alert(response.position);
			alert(response.centralisationType);
		});
		alert("coucou nouvelle version");
	}

}

$(document).ready(launch);