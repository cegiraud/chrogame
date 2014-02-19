/**
 * Created by Charles on 16/02/14.
 */

function launch(){
    var urls = new Array();
    $("div[id^='planet-']").each(function(index, elt){
        var url = $(location).attr('protocol') +'//'+ $(location).attr('host') + $(location).attr('pathname') +'?page=fetchResources&cp=' + elt.id.substring(elt.id.indexOf("-")+1);
        urls.push(url);
    });
    chrome.extension.sendRequest({'urls':urls,'default':$(".planetlink.active")[0].href});
}

$(document).ready(launch);