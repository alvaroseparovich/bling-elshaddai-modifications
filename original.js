//AUXILIO PARA O ESTOQUE
//Organizado v0.5

class includes{ 
	static PATH 	= "https://raw.githubusercontent.com/alvaroseparovich/bling-elshaddai-modifications/" + document.elshaddai_bling_env + "/"; 
	static archives	= {
		1: "includes/back.js",
		2: "includes/front.js",
		3: "includes/sFetch.js",
	
		4: "starters/start_watch_mouse.js",
		5: "starters/start_watch_XMLHttpRequest.js"
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
			this.append_src_to_head(this.PATH + this.archives[n] );
		}

		console.log("");
		console.log("Enviroment -> " + document.elshaddai_bling_env);
	}
};
if(document.compiled){
	includes.include();
};

// Código frente de caixa, nota fiscal e pista
document.back.load_qtd_on_pdv();
document.view.product_green_space_to_click();
style = document.createElement("style");
style.innerHTML = ".imagem_produto{max-height:350px!important} .without-green td, .without-green th{background:white!important;padding-left:0!important;}";
style.innerHTML += "#detalhes_produto #nome_produto{display:contents;}#detalhes_produto #datatable,#detalhes_produto .datatable {padding: 0;width: 31%;} #pop_info > img:hover{width:100%!important;} td[alt='Saldo deste depósito não é considerado'], td[alt='Estoque deste depósito não considerado']{display: none;}#button_qtd:hover>div#qtd{z-index:0!important;margin-left:0!important;}";
document.head.appendChild(style);