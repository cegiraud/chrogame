/** * Created by Fabien on 17/02/14. *///got a message from content scriptchrome.extension.onRequest.addListener(    function(request, sender, sendResponse) {		if (request.method == "moduleCentralisationParams"){			sendResponse(				{					centralisationActive: localStorage["centralisation_active"],					galaxie: localStorage["centralisation_galaxy"],					systeme: localStorage["centralisation_system"],					position: localStorage["centralisation_position"],                    astre:localStorage["astre_centralisation"],					centralisationType: localStorage["type_centralisation"]				}			);		}    });