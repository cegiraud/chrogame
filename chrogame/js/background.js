/** * Created by Charles on 15/02/14. */var ogameResources;var timer;//got a message from content scriptchrome.extension.onRequest.addListener(    function(request, sender, sendResponse) {        ogameResources=request;        clearTimeout(timer);        (function() {timer=setTimeout(refreshData, 1000);})();				if (request.method == "moduleCentralisationParams")			sendResponse(				{					centralisationActive: localStorage["centralisation_active"],					galaxie: localStorage["centralisation_galaxie"],					systeme: localStorage["centralisation_systeme"],					position: localStorage["centralisation_position"],					centralisationType: localStorage["type_centralisation"]				}			);    });function refreshData(){    $.each(ogameResources,function(key, value){       value.quantite += value.production;    });    (function() {timer=setTimeout(refreshData, 1000);})();}