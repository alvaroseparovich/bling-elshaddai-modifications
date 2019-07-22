class includes{ 
	static PATH 	= "https://raw.githubusercontent.com/alvaroseparovich/bling-elshaddai-modifications/" + document.elshaddai_bling_env + "/"; 
	static archives	= {
		"1": "includes/back.js",
		"2": "includes/front.js",
		"3": "includes/sFetch.js",
	
		"4": "starters/start_watch_mouse.js",
		"5": "starters/start_watch_XMLHttpRequest.js",
		"6": "starters/start_style_and_interface.js"
	};

	static httpGet = function(theUrl){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	};
	static append_to_head = function(url){
		var script = document.createElement("script"); 
		script.innerHTML = this.httpGet(url);

		document.head.appendChild(script);
		console.log('URL: "' + url + '" -- was added in head')
	}
	static append_src_to_head = function(url){

		var script = document.createElement("script");
		script.src = url;
		document.head.appendChild(script);

		console.log('SRC: "' + url + '" -- was added in head')
	}
	static include = function(){

		for ( var n in this.archives) {
			if(document.elshaddai_bling_env == "dev"){
				console.log(this.archives[n]);
			}
			this.append_to_head(this.PATH + this.archives[n] );
		}

		console.log("");
		console.log("Enviroment -> " + document.elshaddai_bling_env);
	}
};
if(document.compiled){}else{
	includes.include();
};