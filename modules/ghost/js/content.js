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
            // Page 2: Si on a cliqué sur centraliser, on passe à la suite
            //loadScanRoutineInPage();
            injectScript(generateScanRoutine());
            doFleet2JobGhost();
        }
    });
}

function doFleet2JobGhost(){

    // Creation du bouton de centralisation
    var centraliserButton = $("#continue").clone();
    centraliserButton.attr("id","centraliserButton");
    centraliserButton.removeClass("off");
    centraliserButton.addClass("on");
    centraliserButton.attr("onclick","scan();return false;");
    centraliserButton.children("span").text("Scanner");
    centraliserButton.children("span").attr("style","display: block;color: #fff;text-align: center;height: 38px;line-height: 38px;" +
        "overflow: hidden;font-weight: bold;text-transform: uppercase;font-size: 12px;margin: 0;padding: 0;border: 0;outline: 0;" +
        "cursor: auto;overflow-x: hidden;overflow-y: hidden;");
    centraliserButton.attr("style","margin: 0;padding: 0;height: 38px;width: 104px;float: right;position: static;display: inline;" +
        "background: transparent url('http://gf1.geo.gfsrv.net/cdn34/aaf1c61682bcced5096fa5f23fd802.png') 0 -240px;text-decoration: none;" +
        "color: #848484;-moz-outline-width: 0;outline: 0;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;cursor: auto;text-align: left;");


    // Insertion du bouton de centralisation dans la page
    $("#continue").after(centraliserButton);

    var divScanner = $(".briefing").clone();
    divScanner.children("span").text("Scanner");
    $(".briefing").after(divScanner);

/*


    <div class="briefing border5px">
        <h2></h2>
        <ul id="fleetBriefingPart1" class="fleetBriefing">
            <li>
                <input name="system" id="system" type="text" pattern="[0-9]*" class="system hideNumberSpin" size="3" value="" onfocus="clearInput(this);">
                <input name="system" id="system" type="text" pattern="[0-9]*" class="system hideNumberSpin" size="3" value="" onfocus="clearInput(this);">
            </li>
        </ul>


        <ul id="fleetBriefingPart1_2" class="fleetBriefing">
            <li>Arrivée: <span class="value"><span id="arrivalTime">24.02.14 21:24:50</span> &nbsp;</span></li>
            <li>Retour: <span class="value"><span id="returnTime">24.02.14 21:25:27</span> &nbsp;</span></li>
            <li>Espace cargo disponible: <span class="value" id="storage"><span class="undermark">12.524.985</span></span></li>
        </ul>
    </div>
           */
    //http://s10-fr.ogame.gameforge.com/game/index.php?page=fleetcheck&ajax=1&espionage=0&galaxy=4&system=127&planet=5&type=2&recycler=1
    //galaxy=4&system=127&planet=5&type=2&recycler=1
    //http://s10-fr.ogame.gameforge.com/game/index.php?page=fleetcheck&ajax=1&espionage=0&galaxy=4&system=124&planet=7&type=2&recycler=1
    //http://s119-fr.ogame.gameforge.com/index.php?page=fleetcheck&ajax=1&espionage=0&galaxy=4&system=127&planet=5&type=2&recycler=1
}

function generateScanRoutine(){
 var routine="function scan(){";
    routine+="  var string = 'default';";
    routine+="  var galaxy = $('#galaxy').val();";
    routine+="  var system = $('#system').val();";
    routine+="  $.ajaxSetup({async: false});";
    routine+="  for(pPosition=1; pPosition<16;pPosition++){";
    routine+="      $.get('/game/index.php',{";
    routine+="              page: 'fleetcheck',";
    routine+="              ajax: 1,";
    routine+="              espionage:0,";
    routine+="              galaxy:galaxy,";
    routine+="              system:system,";
    routine+="              planet:pPosition,";
    routine+="              type:2,";
    routine+="              recycler:1},";
    routine+="          function(data){string = data;});";
    routine+="      if(string == 0){";
    routine+="          console.log('['+galaxy+':'+system+':'+pPosition+'] valide');";
    routine+="      }";
    routine+="  }";
    routine+="  $.ajaxSetup({async: false});return false;";
    routine+="}";
   return routine;
}

$(document).ready(launch);

function injectScript(source)
{

    // Utilities
    var isFunction = function (arg) {
        return (Object.prototype.toString.call(arg) == "[object Function]");
    };

    var jsEscape = function (str) {
        // Replaces quotes with numerical escape sequences to
        // avoid single-quote-double-quote-hell, also helps by escaping HTML special chars.
        if (!str || !str.length) return str;
        // use \W in the square brackets if you have trouble with any values.
        var r = /['"<>\/]/g, result = "", l = 0, c;
        do{    c = r.exec(str);
            result += (c ? (str.substring(l, r.lastIndex-1) + "\\x" +
                c[0].charCodeAt(0).toString(16)) : (str.substring(l)));
        } while (c && ((l = r.lastIndex) > 0))
        return (result.length ? result : str);
    };

    var bFunction = isFunction(source);
    var elem = document.createElement("script");    // create the new script element.
    var script, ret, id = "";

    if (bFunction)
    {
        // We're dealing with a function, prepare the arguments.
        var args = [];

        for (var i = 1; i < arguments.length; i++)
        {
            var raw = arguments[i];
            var arg;

            if (isFunction(raw))    // argument is a function.
                arg = "eval(\"" + jsEscape("(" + raw.toString() + ")") + "\")";
            else if (Object.prototype.toString.call(raw) == '[object Date]') // Date
                arg = "(new Date(" + raw.getTime().toString() + "))";
            else if (Object.prototype.toString.call(raw) == '[object RegExp]') // RegExp
                arg = "(new RegExp(" + raw.toString() + "))";
            else if (typeof raw === 'string' || typeof raw === 'object') // String or another object
                arg = "JSON.parse(\"" + jsEscape(JSON.stringify(raw)) + "\")";
            else
                arg = raw.toString(); // Anything else number/boolean

            args.push(arg);    // push the new argument on the list
        }

        // generate a random id string for the script block
        while (id.length < 16) id += String.fromCharCode(((!id.length || Math.random() > 0.5) ?
            0x61 + Math.floor(Math.random() * 0x19) : 0x30 + Math.floor(Math.random() * 0x9 )));

        // build the final script string, wrapping the original in a boot-strapper/proxy:
        script = "(function(){var value={callResult: null, throwValue: false};try{value.callResult=(("+
            source.toString()+")("+args.join()+"));}catch(e){value.throwValue=true;value.callResult=e;};"+
            "document.getElementById('"+id+"').innerText=JSON.stringify(value);})();";

        elem.id = id;
    }
    else // plain string, just copy it over.
    {
        script = source;
    }

    elem.type = "text/javascript";
    elem.innerHTML = script;

    // insert the element into the DOM (it starts to execute instantly)
    document.head.appendChild(elem);

    if (bFunction)
    {
        // get the return value from our function:
        ret = JSON.parse(elem.innerText);

        // remove the now-useless clutter.
        elem.parentNode.removeChild(elem);

        // make sure the garbage collector picks it instantly. (and hope it does)
        delete (elem);

        // see if our returned value was thrown or not
        if (ret.throwValue)
            throw (ret.callResult);
        else
            return (ret.callResult);
    }
    else // plain text insertion, return the new script element.
        return (elem);
}