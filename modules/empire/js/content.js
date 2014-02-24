/**
 * Created by Charles on 16/02/14.
 */

var planetCode;

/**
 * Méthode principale
 */
function launch(){
    document.styleSheets[0].addRule('#title', 'margin: 10px;color: gray');
    document.styleSheets[0].addRule('h1', 'margin: 10px;font-size: 40px;display:inline');
    document.styleSheets[0].addRule('h2', 'display:inline');
    document.styleSheets[0].addRule('#empire','text-align:center');
    document.styleSheets[0].addRule('#empire table','width:100%; color:#9c0; font-size:11px');
    document.styleSheets[0].addRule('#empire table tr:nth-child(even)','background:#0F1216');
    document.styleSheets[0].addRule('#empire table tr:nth-child(odd)','background:#151A1F');


    $("#mmoLogo").html("Vue Empire").css({'font-size':'20px', 'text-indent':'0',background:'none', cursor: 'pointer'})
        .removeAttr('href')
        .click(function(){
        // Récupération de tout le paramétrage du module de centralisation
        chrome.extension.sendRequest({module:"core",method: "getOgameData"}, function(response) {
            buildPage(response);
        });
    });
}

function htmlifyResourcesJSON(json){
    var html = "<div>";
    html+="<p><span>Quantité : </span><span>"+json.quantity.toFixed(0) +"</span></p>";
    html+="<p><span>Production : </span><span>"+(json.production *60 * 60).toFixed(0) +"</span></p>";
    html+="<p><span>Stockage : </span><span>"+json.max.toFixed(0) +"</span></p>";
    html +="</div>";
    return html;
}

function buildPage(ogameData){
    $("body").html(function(){
        var row = {};

        //constructiondes cles du tableaux
        $.each(ogameData.planets, function(planetCode, planet){
            $.each(planet, function(category, vals){
                if(row[category] == undefined){
                    row[category]={};
                }
                $.each(vals, function(subCateg){
                    if(row[category][subCateg] == undefined){
                        row[category][subCateg]={};
                    }

                });
            });
        });

        var contents = "<div id='empire'><div id='title'><h1>Vue Empire</h1><h2><a href='/game/index.php?page=overview'>[Retour]</a></h2></div><table>";

        //infos
        var headerWriten = false;
        var category = 'infos';
        $.each(row[category], function(subCateg){
            contents +="<tr>";
            if(!headerWriten){
                contents +="<td colspan='2' rowspan='" + Object.keys(row[category]).length +"'>Informations</td>";
                headerWriten = true;
            }
            contents +="<td>" + subCateg + "</td>";
            $.each(ogameData.planets, function(){
                var value = "";
                if($(this)[0][category] != undefined &&  $(this)[0][category][subCateg] != undefined ){
                    value =  $(this)[0][category][subCateg];
                }
                contents +="<td>" +value + "</td>";
            });
            contents += "</tr>";
        });


        //resources
        var headerWriten1 = false;
        var category = 'resources';
        $.each(row['resources'], function(subCateg){
            var headerWriten2 = false;
            $.each(['quantity','production','max'], function(index, type){
                contents +="<tr>";
                if(!headerWriten1){
                    contents +="<td rowspan='9'>" + category + "</td>";
                    headerWriten1 = true;
                }
                if(!headerWriten2){
                    contents +="<td rowspan='3'>" + subCateg + "</td>";
                    headerWriten2 = true;
                }
                contents +="<td>" + type + "</td>";

                $.each(ogameData.planets, function(){
                    var value = "";
                    if($(this)[0][category] != undefined &&  $(this)[0][category][subCateg] != undefined ){
                        value =  $(this)[0][category][subCateg][type];
                        if(type =='production') value *=60*60;
                        value = value.toFixed(0).replace(/./g, function(c, i, a) {
                            return i && c !== "." && !((a.length - i) % 3) ? ' ' + c : c;
                        });
                    }
                    contents +="<td>" + value + "</td>";
                });
            });
            contents += "</tr>";
        });


        var headerWriten = false;
        var category = 'buildings';
        $.each(row[category], function(subCateg){
            contents +="<tr>";
            if(!headerWriten){
                contents +="<td colspan='2' rowspan='" + Object.keys(row[category]).length +"'>Batiments</td>";
                headerWriten = true;
            }
            contents +="<td>" + subCateg + "</td>";
            $.each(ogameData.planets, function(){
                var value = 0;
                if($(this)[0][category] != undefined &&  $(this)[0][category][subCateg] != undefined ){
                    value =  $(this)[0][category][subCateg];
                }
                contents +="<td>" +value + "</td>";
            });
            contents += "</tr>";
        });


        var headerWriten = false;
        var category = 'military';
        $.each(row[category], function(subCateg){
            contents +="<tr>";
            if(!headerWriten){
                contents +="<td colspan='2' rowspan='" + Object.keys(row[category]).length +"'>Flotte</td>";
                headerWriten = true;
            }
            contents +="<td>" + subCateg + "</td>";
            $.each(ogameData.planets, function(){
                var value = 0;
                if($(this)[0][category] != undefined &&  $(this)[0][category][subCateg] != undefined ){
                    value =  $(this)[0][category][subCateg].replace(/\./g,'').replace(/./g, function(c, i, a) {
                        return i && c !== "." && !((a.length - i) % 3) ? ' ' + c : c;
                    });
                }
                contents +="<td>" +value + "</td>";
            });
            contents += "</tr>";
        });


        var headerWriten = false;
        var category = 'defensebuilding';
        $.each(row[category], function(subCateg){
            contents +="<tr>";
            if(!headerWriten){
                contents +="<td colspan='2' rowspan='" + Object.keys(row[category]).length +"'>Defense</td>";
                headerWriten = true;
            }
            contents +="<td>" + subCateg + "</td>";
            $.each(ogameData.planets, function(){
                var value = 0;
                if($(this)[0][category] != undefined &&  $(this)[0][category][subCateg] != undefined ){
                    value =  $(this)[0][category][subCateg].replace(/\./g,'').replace(/./g, function(c, i, a) {
                        return i && c !== "." && !((a.length - i) % 3) ? ' ' + c : c;
                    });
                }
                contents +="<td>" +value + "</td>";
            });
            contents += "</tr>";
        });
        contents +="</table>";

        if(ogameData.recherche != undefined){
            contents +="<br/><table><tr><td>Recherche</td>";
            $.each(ogameData.recherche, function(key,value){
                contents +="<td>"+key+"</td>";
            });
            contents +="</tr><tr><td>Niveau</td>";
            $.each(ogameData.recherche, function(key,value){
                contents +="<td>"+value+"</td>";
            });
            contents += "</tr>";
            contents +="</table>";
        }
        contents +="</div>";
        return contents;
    });
}


$(document).ready(launch);