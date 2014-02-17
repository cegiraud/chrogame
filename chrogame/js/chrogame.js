/**
 * Created by Charles on 16/02/14.
 */

function launch(){
    var planetes = $("div[id^='planet-']");
    var nbtotal =  planetes.length;
    var nbReponses = 0;

    var resultat = new Array();
    planetes.each(function(index, elt){
        var url = $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=fetchResources&cp=' + elt.id.substring(elt.id.indexOf("-")+1);
        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data){
                resultat.push(data);
                nbReponses++;
                if(nbReponses==nbtotal){
                    manageData(resultat);
                }
            }
        });
    });
	
	// Detection de la page pour appel au module de centralisation
	var params=extractUrlParams();
	if(params["page"] == "fleet1"){
		centraliser(1);
	}
}


function manageData(resultat){
    //on repositionne l'url...
    $.ajax({url: $(".planetlink.active")[0].href});

    var data= {
        "metal":{"quantite":0,"production":0,"max":0},
        "cristal":{"quantite":0,"production":0,"max":0},
        "deuterium":{"quantite":0,"production":0,"max":0}
    };

    $.each(resultat,function(key, value){
        data.metal.quantite +=value.metal.resources.actual;
        data.metal.production +=value.metal.resources.production;
        data.metal.max +=value.metal.resources.max;

        data.cristal.quantite +=value.crystal.resources.actual;
        data.cristal.production +=value.crystal.resources.production;
        data.cristal.max +=value.crystal.resources.max;

        data.deuterium.quantite +=value.deuterium.resources.actual;
        data.deuterium.production +=value.deuterium.resources.production;
        data.deuterium.max +=value.deuterium.resources.max;
    });
    chrome.extension.sendRequest(data);
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

function centraliser(numPage){
	//alert("Centraliser page:"+numPage);
	chrome.extension.sendRequest({method: "getCentralisationActive"}, function(response) {
		//alert(response.centralisationActive);
	});
}

$(document).ready(launch);