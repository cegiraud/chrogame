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
            doFleet2JobGhost();
        }
    });
}

function doFleet2JobGhost(){
    // Creation du bouton scan
    var scannerButton = $("#continue").clone();
    scannerButton.children("span").text("Scanner");
    scannerButton.removeClass("off").addClass("on");
    scannerButton.bind("click",function(){
        emptyScanField();
        scan();
    });



    // Creation du conteneur du bouton scan
    var scanButtonContainer = jQuery('<div/>', {
        id: 'steps'});
    scanButtonContainer.append(scannerButton);


    // Initialisation de la liste des CDR
    var listeCDR = jQuery('<ul/>', {
        id: 'lstCDR',
        class: 'fleetBriefing'});

    // Initialisation de l'intervalle de coords
    var listeCoords = jQuery('<ul/>', {
        id: 'lstCoords',
        class: 'fleetBriefing'});

    // Creation des input d'intervalle de scan
    var liD = $("<li>Galaxie:</li>");
    var inputG = $("<input type='text' id='inputG' class='galaxy' size='1'/>");
    inputG.val($('#galaxy').val());
    liD.append(inputG);
    listeCoords.append(liD);

    var li = $("<li style='margin-top:10px'></li>");
    var inputSD = $("<input type='text' id='inputSD' class='system' size='3'/>");
    var inputSF = $("<input type='text' id='inputSF' class='system' size='3'/>");
    var systemCourant = $('#system').val();
    inputSD.val(systemCourant);
    inputSF.val(systemCourant);
    li.append("SD:");
    li.append(inputSD);
    li.append(" SF:");
    li.append(inputSF);
    listeCoords.append(li);

    // Composition de la boite de l'extension
    var resulatScanBox = jQuery("<div style='height:300px'/>");
    resulatScanBox.addClass("briefing border5px");
    resulatScanBox.append("<h2>Ghost Module</h2>");
    resulatScanBox.append(listeCDR);
    resulatScanBox.append(listeCoords);
    resulatScanBox.append(scanButtonContainer);
    $(".briefing").after(resulatScanBox);
}

function emptyScanField(){
    $("#lstCDR").empty();
    $('#position').val("");
    return false;
}

function scan(){
    var string = 'default';
    var galaxy = $('#inputG').val();
    var systemD = $('#inputSD').val();
    var systemF = $('#inputSF').val();
    $.ajaxSetup({async: false});
    for(system=systemD; system<=systemF;system++){
        for(position=1; position<16;position++){
            $.get('/game/index.php',{
                    page: 'fleetcheck',
                    ajax: 1,
                    espionage:0,
                    galaxy:galaxy,
                    system:system,
                    planet:position,
                    type:2,
                    recycler:1},
                function(data){
                    string = data;
                });

            if(string == 0){
                // Ajout des Coords du CDR dans la liste
                var cdrCoord = $("<li><div style='color:green;'>["+galaxy+":"+system+":"+position+"]</div></li>") ;
                cdrCoord.data("galaxie", galaxy) ;
                cdrCoord.data("systeme", system) ;
                cdrCoord.data("position", position) ;
                cdrCoord.bind("click", function(){
                    $('#galaxy').val($(this).data("galaxie"));
                    $('#system').val($(this).data("systeme"));
                    $('#position').val($(this).data("position"));
                    $("#dbutton").get(0).click();
                });
                $("#lstCDR").append(cdrCoord);
            }
        }
    }
    $.ajaxSetup({async: false});
    return false;
}

$(document).ready(launch);