//El Shaddai Code Help
//V1.3

//Enviroment Declaration
// enviroments = master & dev

document.elshaddai_bling_env = "master";

function httpGet(theUrl){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", theUrl, false );xmlHttp.send( null );return xmlHttp.responseText;}
script = document.createElement("script");script.innerHTML = httpGet("https://raw.githubusercontent.com/alvaroseparovich/bling-elshaddai-modifications/" + document.elshaddai_bling_env + "/original.js");
document.head.appendChild(script);