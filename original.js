//AUXILIO PARA O ESTOQUE
//Organizado v0.5

class includes{ 
	static PATH 	= "https://raw.githubusercontent.com/alvaroseparovich/bling-elshaddai-modifications/dev/"; 
	static Back 	= this.PATH + "includes/back.js";
	static Front 	= this.PATH + "includes/front.js";
	static SFetch 	= this.PATH + "includes/sFetch.js";

	static httpGet = function(theUrl){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	};
	static append_to_head = function(url){
		script = document.createElement("script"); 
		script.innerHTML = this.httpGet(url);

		document.head.appendChild(script);
		console.log('URL: "' + url + '" -- was added in head')
	}
	static append_src_to_head = function(url){

		script = document.createElement("script"); 
		script.src = url;
		document.head.appendChild(script);

		console.log('SRC: "' + url + '" -- was added in head')
	}
	static include = function(){

		this.append_to_head(this.SFetch);
		this.append_to_head(this.Back);
		this.append_to_head(this.Front);
	}
}
includes.include();

document.onclick = function(e){
	pop = document.querySelector("#pop_info");
	if(e.target != pop && e.target.parentElement != pop && e.target.parentElement.parentElement.parentElement.parentElement.parentElement == document.querySelector("#datatable")){
		console.log("This is the element");
		document.back.process_clicked_item(e.target.parentElement);
	}else if(pop){
		pop.parentElement.removeChild(pop);
	}
};
(function() {

    var origOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
        	document.back.process(this);
        	//console.log("capturado o XHR");
        });
    	origOpen.apply(this, arguments);
    };
})();

// Código frente de caixa, nota fiscal e pista
document.back.load_qtd_on_pdv();
document.view.product_green_space_to_click();
style = document.createElement("style");
style.innerHTML = ".imagem_produto{max-height:350px!important} .without-green td, .without-green th{background:white!important;padding-left:0!important;}";
style.innerHTML += "#detalhes_produto #nome_produto{display:contents;}#detalhes_produto #datatable,#detalhes_produto .datatable {padding: 0;width: 31%;} #pop_info > img:hover{width:100%!important;} td[alt='Saldo deste depósito não é considerado'], td[alt='Estoque deste depósito não considerado']{display: none;}#button_qtd:hover>div#qtd{z-index:0!important;margin-left:0!important;}";
document.head.appendChild(style);