function sFetch(id = 0, type = 0, handle_response = 0) {
	this.response = "";
	this.parsedXML = "";
	this.DOMObj = "";

	this.fetch = function(url,headers, handle_response = 0){
		fetch(url,headers)
		.then( response => response.text() )
		.then( data => { 
			this.response = data; 
			if(handle_response){
				handle_response(data);
			}else{
				console.log(data);
			}
		} )
		//.then( strResponse => {this.parsedXML = this.strToXML(strResponse);})
	};
	this.xmlToJson= function( xml = this.parsedXML ) {// Unminifyed code on https://gist.github.com/chinchang/8106a82c56ad007e27b1
		var obj={};
		if(1==xml.nodeType){if(xml.attributes.length>0){obj["@attributes"]={};for(var j=0;j<xml.attributes.length;j++){var attribute=xml.attributes.item(j);obj["@attributes"][attribute.nodeName]=attribute.nodeValue}}}else 3==xml.nodeType&&(obj=xml.nodeValue);if(xml.hasChildNodes()&&1===xml.childNodes.length&&3===xml.childNodes[0].nodeType)obj=xml.childNodes[0].nodeValue;else if(xml.hasChildNodes())for(var i=0;i<xml.childNodes.length;i++){var item=xml.childNodes.item(i),nodeName=item.nodeName;if(void 0===obj[nodeName])obj[nodeName]=xmlToJson(item);else{if(void 0===obj[nodeName].push){var old=obj[nodeName];obj[nodeName]=[],obj[nodeName].push(old)}obj[nodeName].push(xmlToJson(item))}} return obj;
	};
	this.strToXML = function( stringToParse = this.response ){
		if (window.DOMParser) {/*code for modern browsers*/	
			parser = new DOMParser();return parser.parseFromString( stringToParse , "text/xml" );
		} else { /*code for old IE browsers*/ 
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");xmlDoc.async = false;return xmlDoc.loadXML(text);
		} 
	};
	this.strToHTML = function ( htmlString = this.response ) {
	  var div = document.createElement('div'); 
	  div.innerHTML = htmlString.trim();
	  this.DOMObj = div; 
	  return div; 
	};
	this.processHTMLStoque = function(text = this.parsedXML){
		//@ parsedXML = XML
		//Return -> HTML
		
		console.log(text);
		json = JSON.parse(text);
		Jsaldos = json.totais.saldosPorDeposito;
		tableText = `<table id="tabela-saldo-deposito"> <thead><tr><th>Depósito</th><th style="float: right;">Saldo</th></tr></thead><tbody>`;
		Jsaldos.forEach(e=>{
			tableText += "<tr><td title>" + e.descricao + "</td>";
			tableText += "<td align='right' title>" + parseInt(e.saldo) + "</td></tr>";
		})
		tableText += "</tbody></table>";
		element = document.createElement("div");
		element.innerHTML = tableText;
		this.DOMObj = element;
		return element;
	};

	
	//=========================   GETers   =========================
	//===============================================================
	this.getCookie = function(cname="WSSID") {//code of https://www.w3schools.com/js/js_cookies.asp
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
	  	var c = ca[i];
	  	while (c.charAt(0) == ' ') {c = c.substring(1);}
	  	if (c.indexOf(name) == 0) {
	  		return c.substring(name.length, c.length);
	  	}
	  }return "";
	};
	this.getStockById = function( productID = "2817352204" , handle_response = 0){
		var cookie = this.getCookie();
		header = {
			"credentials":"include",
			"headers":{
				"accept":"*/*",
				"accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
				"cache-control":"no-cache",
				"content-type":"application/x-www-form-urlencoded",
				"pragma":"no-cache",
				"sec-fetch-mode":"cors",
				"sec-fetch-site":"same-origin",
				"session-token":cookie
			},
			"referrer":"https://www.bling.com.br/estoque.php?",
			"referrerPolicy":"no-referrer-when-downgrade",
			"body":"xajax=listarLancamentos&xajaxs="+cookie+"&xajaxr=1560859712223&xajaxargs[]=ultimos&xajaxargs[]="+productID+"&xajaxargs[]=0&xajaxargs[]=1&xajaxargs[]=&xajaxargs[]=&xajaxargs[]=5888049670&xajaxargs[]=",
			"method":"POST",
			"mode":"cors"
		};
		if(handle_response){
			this.fetch("https://www.bling.com.br/services/estoques.server.php?f=listarLancamentos", header , handle_response);
		}else{
			return this.fetch("https://www.bling.com.br/services/estoques.server.php?f=listarLancamentos", header );
		}
	};
	this.getImgById = function( productID = "2817352204" , handle_response = 0){
		var cookie = ""+this.getCookie();
		header = {"credentials":"include",
			"headers":{
				"accept":"*/*",
				"accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
				"content-type":"application/x-www-form-urlencoded",
				"session-token":cookie
			},
				"referrer":"https://www.bling.com.br/pdv.php",
				"referrerPolicy":"no-referrer-when-downgrade",
				"body":"xajax=obterProduto&xajaxs="+cookie+"&xajaxr=1560444290700&xajaxargs[]=%3Cxjxobj%3E%3Ce%3E%3Ck%3Eid%3C%2Fk%3E%3Cv%3E"+productID+"%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EidLoja%3C%2Fk%3E%3Cv%3E203331767%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EidVenda%3C%2Fk%3E%3Cv%3E0%3C%2Fv%3E%3C%2Fe%3E%3Ce%3E%3Ck%3EidDeposito%3C%2Fk%3E%3Cv%3E5888049670%3C%2Fv%3E%3C%2Fe%3E%3C%2Fxjxobj%3E",
				"method":"POST",
			"mode":"cors"};
		if(handle_response){
			this.fetch("https://www.bling.com.br/services/frentes.caixas.server.php?f=obterProduto", header, handle_response);
		}else{
			this.fetch("https://www.bling.com.br/services/frentes.caixas.server.php?f=obterProduto", header);
		}
	};
	this.getMultilojaPrice = function( productID = "2817352204" , handle_response = 0){
		var cookie = ""+this.getCookie();
		//console.log("Get Multiloja Price");
		header = {"credentials":"include",
			"headers":{
				"accept":"*/*",
				"accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
				"content-type":"application/x-www-form-urlencoded",
				"session-token":cookie
			},
			"referrer":"https://www.bling.com.br/produtos.php",
			"referrerPolicy":"no-referrer-when-downgrade",
			"body":"xajax=obterVinculoProdutosMultilojas&xajaxs=" + cookie + "&xajaxr=1562091621113&xajaxargs[]=" + productID,
			"method":"POST",
			"mode":"cors"
		};
		if(handle_response){
			this.fetch("https://www.bling.com.br/services/produtos.server.php?f=obterVinculoProdutosMultilojas", header , handle_response);
		}else{
			return this.fetch("https://www.bling.com.br/services/produtos.server.php?f=obterVinculoProdutosMultilojas", header );
		}
	};
	this.getEditora = function( productID = "2817352204" , handle_response = 0){
		var cookie = ""+this.getCookie();
		header = {
			"credentials":"include",
			"headers":{
				"accept":"*/*",
				"accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
				"content-type":"application/x-www-form-urlencoded",
				"session-token":cookie
			},
			"referrer":"https://www.bling.com.br/produtos.php",
			"referrerPolicy":"no-referrer-when-downgrade",
			"body":"xajax=obterProduto&xajaxs=" + cookie + "&xajaxr=1563218566001&xajaxargs[]=" + productID,
			"method":"POST",
			"mode":"cors"
		};
		if(handle_response){
			this.fetch("https://www.bling.com.br/services/produtos.server.php?f=obterProduto", header , handle_response);
		}else{
			return this.fetch("https://www.bling.com.br/services/produtos.server.php?f=obterProduto", header );
		}
	};

	if(id){
		if(type == "img"){
			return this.getImgById(id);
		}else if( type == "stock"){
			this.getStockById(id);
		}
	};
} document.sf = new sFetch();
