//ESTOQUE ------- tela pequrna
//AUXILIO PARA O ESTOQUE - SEM MODIFICAÇÔES NA TELA DE VENDA
//Com preço e estoque na pista e caixa v0.2

document.onclick = function(e){
	pop = document.querySelector("#pop_info");
	if(e.target != pop && e.target.parentElement != pop && e.target.parentElement.parentElement.parentElement.parentElement.parentElement == document.querySelector("#datatable")){
		console.log("This is the element");
		back.process_clicked_item(e.target.parentElement);
	}else if(pop){
		pop.parentElement.removeChild(pop);
	}
}

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
	this.processHTMLStoque = function(parsedXML = this.parsedXML){
		//@ parsedXML = XML
		//Return -> HTML

		innerHTMLstr = parsedXML.documentElement.querySelector("[t='totalEstoque']").innerHTML;
		numberStartersCharacteres = 9;
		subHTMLStr = innerHTMLstr.substr(numberStartersCharacteres, innerHTMLstr.length - (numberStartersCharacteres + 3));
		div = this.strToHTML(subHTMLStr);
		divTable = div.querySelector("table.datatable")
		this.DOMObj = divTable;
		return divTable;
	};
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
				"content-type":"application/x-www-form-urlencoded",
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
} s = new sFetch(); document.sF = new sFetch();

function Back(){
	this.produtos_lookup_last_list = 0;
	this.instance = 0;

	this.show = new Front();
	this.process = function(xhr){
		//if( xhr.responseURL == "https://www.bling.com.br/services/frentes.caixas.server.php?f=obterProduto" /*&& document.URL == "https://www.bling.com.br/pdv.php"*/  ){
		if( /(https:\/\/www\.bling\.com\.br\/services\/frentes\.caixas\.server\.php.*)/.test(xhr.responseURL) /*&& document.URL == "https://www.bling.com.br/pdv.php"*/  ){
        	//Pagina de frente de caixa.
        	//Chamar o Estoque, Chamar preço real e mostrar o desconto
			        
        	// Get Estoque  ------------------------------------------------------------------------
        	sf = new sFetch();
	       	responseJson = JSON.parse( xhr.response );
	       	productId = this.match_isbn_title_in_list(responseJson['codigo'],responseJson['nome']);
        	sf.getStockById( productId, this.process_get_estoque_request );

        	//Get Price and %   --------------------------------------------------------------
        	sf.getMultilojaPrice(productId, this.process_price_multiloja_request);
			
			//Get Editora -------------------
			sf.getEditora(productId, this.process_editora_pdv_request );



			return;
        } else
        //Store the result in produtos_lookup_last_list
        if(/(https:\/\/www\.bling\.com\.br\/services\/produtos\.lookup\.php\?.*)/.test(xhr.responseURL) ){
			
			sf = new sFetch();  
			responseJson = JSON.parse( xhr.response );
	       	productId = this.match_isbn_title_in_list(responseJson['codigo'],responseJson['nome']);      	
        	sf.getMultilojaPrice(productId, this.process_price_multiloja_request);

        	this.produtos_lookup_last_list = JSON.parse(xhr.response);


        	if(document.querySelector("ui#ui-id-4")){
        		document.querySelector("ui#ui-id-4").onmouseover(this.process_nota_fiscal_by_mouse);
        	}
		}
	};
	this.popUp_image_name_isbn_stock = function(element){
		this.show.popup();
		sf = new sFetch();
		if(typeof element == "number" || typeof element == "string"){
			sf.getImgById(element, this.process_pop_img_request);
			sf.getStockById(element, this.process_pop_stock_request);
			sf.getMultilojaPrice(element, this.process_price_multiloja_request);
			sf.getEditora(element, this.process_editora_pop_request );
		}else{
			sf.getImgById(element.id, this.process_pop_img_request);
			sf.getStockById(element.id, this.process_pop_stock_request);
			sf.getMultilojaPrice(element.id, this.process_price_multiloja_request);
			sf.getEditora(element.id, this.process_editora_pop_request );
		}
	}
	this.process_clicked_item = function(element){
		
		this.popUp_image_name_isbn_stock(element);
	};
	this.process_pop_img_request = function(response){
		//console.log(response);
		responseJson = JSON.parse(response);
		(responseJson.imagem[0])
			?src = responseJson.imagem[0]:src = "https://elshaddai.com.br/wp-content/uploads/2019/06/4542953-e1560887832726.jpg";
		title = responseJson.nome;
		isbn = responseJson.codigo;

		show = new Front();
		show.pop_img_estoque(src);
		show.pop_title_product(title);
		show.pop_isbn_product(isbn);
	};
	this.process_pop_stock_request = function(response){
		sf = new sFetch();
		HTMLStoque = sf.processHTMLStoque( sf.strToXML( response ) );
		show = new Front();
		show.pop_stock_product(HTMLStoque);
	};
	this.process_get_estoque_request = function(str){

		//console.log("process_get_estoque_request(" + str + ")");
		sf = new sFetch();
		HTMLStoque = sf.processHTMLStoque( sf.strToXML( str ) );
		show = new Front();
		show.on_pdv_estoque(HTMLStoque);
	};
	this.process_price_multiloja_request = function(response){

		sf = new sFetch();
		f = sf.strToXML(response);
		element = "" + f.querySelector("cmd:nth-child(3n)").innerHTML;
		element = element.substr( 40 );
		element = "[" + element.substr( 0, element.length - 5 ) + "]";

		json =  JSON.parse(element);
		json = json[0];

		show = new Front();
		json = json.forEach(function(element,index,array){
		 if(element.nomeLoja == "Livraria Física El Shaddai"){
		 	 if(/(https:\/\/www\.bling\.com\.br\/pdv\.*)/.test(document.URL) ){
		 		show.on_pdv_price(element.preco, element.precoPromocional);
		 	 }else{
		 		this.show.pop_price_product(element.preco, element.precoPromocional);
		 	 }
		 } 
		});
	};
	this.load_qtd_on_pdv = function(){
		if(/(.*Frente de Caixa - Bling.*)/.test( document.title )){
			rodape_produtos = document.querySelector("#rodape_produtos");
			button = document.createElement("button");
			button.style = "border:none;outline:none;order:-1;display:flex;align-items:center;padding:0;";
			button.id = "button_qtd";
			button.onclick = document.back.get_qtd_on_pdv;
			button.onmouseover = document.back.get_qtd_on_pdv;
			button.innerHTML = '<h2 style="background:green;font-size:1.2em;color:white;font-weight:bold;padding:0.5em;border:none;outline:none;margin:0;height:44px;width:74px;z-index:2;">Contar itens</h2>';
			button.innerHTML += '<div id="qtd" style="font-size:3em;margin-left:-51%;padding:0 0.3em;display:block;z-index:-1;transition-duration: 0.5s;">N</div>';
			rodape_produtos.appendChild(button);
		}
	};
	this.match_isbn_title_in_list = function( isbn='9788527505925', title='Ego transformado', list = this.produtos_lookup_last_list ){
		for(let i = 0; i < list.length; i++){

		   if(list[i].value == title && list[i].codigo == isbn){
		   		return list[i].id
		   }
		}
		return "Erro: Item Não encontrado na lista"
	};
	this.get_element_in_list = function(key, list = this.produtos_lookup_last_list ){
		
		return list[key];
	};
	this.validator = function(OBJ,key){
	    if(typeof(key) == "object"){//console.log("is obj");
	        for (var i = 0; i<key.length; i++){// this will test ALL elements of the object
	            if(!OBJ.hasOwnProperty(key[i])){
	                return false
	            }else{//console.log( key[i] + " - found" )
	            }
	        }
	        return true
	    }else{
	        console.log("não funcionando");
	        return false;
	    }
	};
	this.process_nota_fiscal_popup_by_arrow = function(event){
		
		if( /(https:\/\/www\.bling\.com\.br\/pdv.*)/.test(document.URL) ){
			//console.log('HEY HEY HEY');
		}else{
			if(event.code == "ArrowDown" || event.code == "ArrowUp" ){
				//console.log( document.back.get_ui_id_4_focus_number());
				number = document.back.get_ui_id_4_focus_number();
				element = document.back.get_element_in_list(number);
				id = element["id"];
				if(id > -1){
					document.back.popUp_image_name_isbn_stock(id);
				}
			}
		}
	};
	this.process_nota_fiscal_popup_by_mouse = function(instance){
		//console.log(event.target);
		//Verfica qual o contexto de execução para chamar o Objeto ou instancia corretamente.
		if(this.constructor.name == "HTMLUListElement"){
			//console.log( this.back.get_ui_id_4_focus_number());
			number = this.back.get_ui_id_4_focus_number();
			element = this.back.get_element_in_list(number);
			id = element["id"];
			if(id){
				this.back.popUp_image_name_isbn_stock(id);
			}
		}else{
			console.log( this.get_ui_id_4_focus_number() + "----------------- NOT HTML ELEMENT!" );
		}
	};
	this.get_ui_id_4_focus_number = function(number = 0){
		Array.prototype.slice.call(	document.querySelectorAll("ul#ui-id-4 > li") )
		.forEach(
			function(elm,ind,arr){
				console.log(ind);
				if(/.*(ui-state-focus).*/.test(elm.querySelector("a").classList.value)){
					number = ind;
					return;
				}
			}
		);
		if (number || number > -1){
			return number
		};
	};
	this.active_popup_on_ui_id_4 = function(){
		document.addEventListener("keydown", back.process_nota_fiscal_popup_by_arrow );
	};
	this.get_qtd_on_pdv = function(){
		try{
			tbody = document.querySelector("#body_produtos>tbody");
			arrayItens = Array.apply(null,tbody.querySelectorAll("td[data-quantidade]"));
		}catch(err){
			document.view.show_qtd_on_pdv("N");
			return;	
		}

		result = 0;
		for (index in arrayItens){
			innerText = arrayItens[index].innerText;
			number = parseInt(innerText);
			if( number > 0 ){
				result += number;
			}
		}
		document.view.show_qtd_on_pdv(result);
	};
	this.process_editora_pdv_request = function(response){
		document.back.CORE_process_editora_request( response , 'on_pdv_editora' );
	};
	this.process_editora_pop_request = function(response){
		document.back.CORE_process_editora_request( response , 'pop_editora_product' );
	};
	this.CORE_process_editora_request = function(response, where){
		s = new sFetch();
		responseXML = s.strToXML(response);

		arrTxt = responseXML.querySelector("cmd:nth-child(90)").innerHTML;
		arrTxt = arrTxt.substr(24,arrTxt.length-34);
		arrEditoras = JSON.parse(arrTxt);

		document.resp = arrEditoras;

		editoraApplied = false;
		for(editora in arrEditoras){
			if ('marcado' in arrEditoras[editora]){
				if(arrEditoras[editora].nomeGrupo == 'Editora'){
					document.view[where](arrEditoras[editora].nome);
				}
			}
		}
	};
} var back = new Back(); document.back = back; back.active_popup_on_ui_id_4();

function Front(){
	this.bd = document.querySelector("body");

	this.on_pdv_price = function(price, salePrice){
		arrayElements = this.price_to_HTML_elements(price, salePrice, true);

		arrayElements.percentageElement.style	 = "color: white;background: green;padding: 2px 6px;display: inline;right: 0;font-size: 3em;";
		arrayElements.salePriceElement.style	 = "font-size: 1.5em;";
		arrayElements.priceElement.style		 = "font-size: 2em;";

		div 		= document.createElement("div");
		div.style 	= "display: inline-block;font-size: 1em;position: absolute;right: 100px;";
		div.appendChild( arrayElements.salePriceElement );
		div.appendChild( arrayElements.priceElement );

		priceElement 		= document.createElement("div");
		priceElement.style	= "display: inline; position: absolute; bottom: 0; right: 0;";
		priceElement.id 	= "price_element";
		
		priceElement.appendChild( div );
		priceElement.appendChild( arrayElements.percentageElement );

		detalhes_produto = this.bd.querySelector("#detalhes_produto");
		if(detalhes_produto.querySelector("#price_element")){
			detalhes_produto.removeChild(detalhes_produto.querySelector("#price_element"))
		}
		detalhes_produto.appendChild(priceElement);
	}
	this.price_to_HTML_elements = function(price, salePrice, returnArray = false){
		divPriceElement = document.createElement("div"); 
		
		salePriceElement = document.createElement("del");
		salePriceElement.innerText = "R$" + price;
		
		priceElement = document.createElement("h2");
		priceElement.innerText = "R$" + salePrice;

		percentageElement = document.createElement("h1");
		salePriceFloat = parseFloat(salePrice.replace('.','').replace(',','.'));
		priceFloat = parseFloat(price.replace('.','').replace(',','.'));
		percentageElement.innerText = "%" + ( 100 - salePriceFloat*100/priceFloat ).toFixed();
		percentageElement.style = "color: white;background: green;padding: 2px 6px;display: inline;right: 0;margin-top: -40px;position: fixed;font-size: 3em;";

		divPriceElement.appendChild(salePriceElement);
		divPriceElement.appendChild(priceElement);
		divPriceElement.appendChild(percentageElement);

		divPriceElement.style = "order:3;";
		
		if(returnArray){
			return { 'salePriceElement': salePriceElement, 'priceElement': priceElement, 'percentageElement' : percentageElement, 'divPriceElement' : divPriceElement };
		}else{
			return divPriceElement;
		}
	}
	this.on_pdv_estoque = function(DOMObj){
		
		DOMObj.style = "position:absolute;right:0;width:auto;top:20px;";
		DOMObj.classList.add("without-green");
		detalhes_produto = this.bd.querySelector("#detalhes_produto");
		if(detalhes_produto.querySelector(".datatable")){
			detalhes_produto.removeChild(detalhes_produto.querySelector(".datatable"))
		}
		detalhes_produto.appendChild(DOMObj);
	}
	this.on_pdv_editora = function(nomeEditora){
		console.log(nomeEditora);
		h2 = document.createElement("h2");
		h2.id = "editora_da_livro";
		h2.innerHTML = '<span style="background: gray; color: white; padding: 0.3em;">{0}</span>'.replace('{0}',nomeEditora);

		document.view.delete_editora_pdv();

		detalhes_produto = document.body.querySelector("#detalhes_produto");
		detalhes_produto.appendChild(h2);
	}
	this.pop_img_estoque = function(element){
		
		if (typeof element == "string"){
			img = document.createElement("img");
			img.src = element
		}else{
			img = element;
		}
		img.style = "width:20vh;max-width: 100%;order:0;"
		this.append_to_pop(img);
	}
	this.pop_title_product = function(title){
		element = document.createElement("h2");
		element.style = "order:1;font-size: 1.2em;";
		element.innerText = title;

		this.append_to_pop(element);
	}
	this.pop_isbn_product = function(isbn){
		element = document.createElement("h3");
		element.style = "order:2;margin: 0;color: #3faf6c;";
		element.innerText = isbn;

		this.append_to_pop(element);
	}
	this.pop_price_product = function(price, salePrice){

		pricesElement = this.price_to_HTML_elements(price, salePrice);
		this.append_to_pop(pricesElement);
	}
	this.pop_stock_product = function(DOMObj){
		DOMObj.style = "order:10;"
		this.append_to_pop(DOMObj);
	}
	this.pop_editora_product = function(nomeEditora){
		deleteBtn = document.querySelector("#delete_button");
		deleteBtn.innerHTML ='<h2 style="color: white; text-align:center;">{0}</h2>'.replace('{0}',nomeEditora) ;
	}
	this.show_qtd_on_pdv = function(n){
		qtd = document.querySelector("#button_qtd>#qtd");
		qtd.innerHTML = n;
	}
	this.popup = function(isbn = '#'){

		if ( !this.delete_popup(isbn) ){
			return false
		};

		popup = document.createElement("div");
		popup.id = "pop_info";
		popup.style = "position:fixed;top:0;right:0;z-index:41;width:250px;background:#f2f2f2;padding:10px;margin-top:44px;display:flex;flex-direction:column;border: solid #3faf6c;";

		delete_button = document.createElement("div");
		delete_button.addEventListener("click" , this.delete_popup );
		delete_button.id = "delete_button";
		delete_button.style = "height: 25px;margin:-10px -10px 4px;background:gray;order:-1;";
		popup.appendChild(delete_button);

		this.bd.appendChild(popup);
	}
	this.append_to_pop = function( element ){
		popup = this.bd.querySelector("#pop_info");
		popup.appendChild(element);
	}
	this.delete_popup = function(isbn = '#'){


		popup = document.querySelector("body").querySelector("#pop_info");
		if(popup){
			if( popup.querySelector("h3").innerText != isbn){
				popup.parentElement.removeChild(popup);
				return true;
			}else{
				return false;
			}
		}
		return true;
	}
	this.delete_editora_pdv = function(isbn = '#'){

		editora_on_pdv = document.querySelector("#detalhes_produto").querySelector("#editora_da_livro");
		if(editora_on_pdv){
			editora_on_pdv.parentElement.removeChild(editora_on_pdv);
		}
	}
	this.product_green_space_to_click = function(){
		if(/(.*Produtos - Bling.*)/.test( document.title )){
			style = document.createElement("style");
			style.innerHTML = "@media screen and (min-width:992px){.imagem_produto{max-height:350px!important}.box-content #datatable td:first-child,.box-content #datatable th:first-child,.box-content .datatable td:first-child,.box-content .datatable th:first-child{padding-left:40px;background:rgba(63,175,108,1);background:linear-gradient(to right,rgba(63,175,108,1) 0,rgba(63,175,108,1) 47%,rgba(63,175,108,0) 47%,rgba(63,175,108,0) 48%,rgba(255,255,255,0) 49%,rgba(255,255,255,0) 100%)}}"
			document.head.appendChild(style);
		}
	}
} front = new Front(); document.view = new Front();

(function() {
    
    var origOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
        	back.process(this);
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