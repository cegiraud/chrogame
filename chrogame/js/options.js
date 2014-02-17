// Saves options to localStorage.
function save_options() {
  var centralisationActive = document.getElementById("centralisationActive").checked;
  localStorage["centralisation_active"] = centralisationActive;
	
  var galaxie = document.getElementById("galaxie").value;
  localStorage["centralisation_galaxie"] = galaxie;

  var systeme = document.getElementById("systeme").value;
  localStorage["centralisation_systeme"] = systeme;
  
  var position = document.getElementById("position").value;
  localStorage["centralisation_position"] = position;
  
  var select = document.getElementById("centralisationType");
  var centralisationType = select.children[select.selectedIndex].value;
  localStorage["type_centralisation"] = centralisationType;
  
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Coordonnées Sauvegardée.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restaure les options sauvegardées
function restore_options() {
  var centralisationActive = localStorage["centralisation_active"];
  if (!centralisationActive) {
    return;
  }	
  document.getElementById("centralisationActive").checked=centralisationActive;
  
  var galaxie = localStorage["centralisation_galaxie"];
  if (!galaxie) {
    return;
  }
  document.getElementById("galaxie").value=galaxie;

  var systeme = localStorage["centralisation_systeme"];
  if (!systeme) {
    return;
  }
  document.getElementById("systeme").value=systeme;
  
    var position = localStorage["centralisation_position"];
  if (!position) {
    return;
  }  
  document.getElementById("position").value=position;
  
  var centralisationType = localStorage["type_centralisation"];
  if (!centralisationType) {
    return;
  }
  var select = document.getElementById("centralisationType");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == centralisationType) {
      child.selected = "true";
      break;
    }
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);