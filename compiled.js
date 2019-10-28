document.compiled = true;function Back(){
	this.produtos_lookup_last_list = 0;
	this.instance = 0;

	//=========================   PROCESS   =========================
	//===============================================================
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
		HTMLStoque = document.sf.processHTMLStoque( response );
		document.view.pop_stock_product(HTMLStoque);
	};
	this.process_get_estoque_request = function(str){
		HTMLStoque = document.sf.processHTMLStoque( str );
		document.view.on_pdv_estoque(HTMLStoque);
	};
	this.process_price_multiloja_request = function(response){

		f = document.sf.strToXML(response);
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

			number = document.back.get_ui_id_4_focus_number();
			element = document.back.get_element_in_list(number);
			id = element["id"];
			if(id){
				document.back.popUp_image_name_isbn_stock(id);
			}
		}else{
			console.log( this.get_ui_id_4_focus_number() + "----------------- NOT HTML ELEMENT!" );
		}
	};
	this.process_editora_pdv_request = function(response){
		document.back.CORE_process_editora_request( response , 'on_pdv_editora' );
	};
	this.process_editora_pop_request = function(response){
		document.back.CORE_process_editora_request( response , 'pop_editora_product' );
	};
	this.CORE_process_editora_request = function(response, where){
		
		responseXML = document.sf.strToXML(response);

		arrTxt = responseXML.querySelector("cmd:nth-child(92)").innerHTML;
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


	//=======================   STARTERS   =========================
	//==============================================================
	this.process = function(xhr){
		//if( xhr.responseURL == "https://www.bling.com.br/services/frentes.caixas.server.php?f=obterProduto" /*&& document.URL == "https://www.bling.com.br/pdv.php"*/  ){
		if( /(https:\/\/www\.bling\.com\.br\/services\/frentes\.caixas\.server\.php.*)/.test(xhr.responseURL) /*&& document.URL == "https://www.bling.com.br/pdv.php"*/  ){
        	//Pagina de frente de caixa.
        	//Chamar o Estoque, Chamar preço real e mostrar o desconto
			        
        	// Get Estoque  ------------------------------------------------------------------------
	       	responseJson = JSON.parse( xhr.response );
	       	productId = this.match_isbn_title_in_list(responseJson['codigo'],responseJson['nome']);
			document.sf.getStockById( productId, this.process_get_estoque_request );

        	//Get Price and %   --------------------------------------------------------------
        	document.sf.getMultilojaPrice(productId, this.process_price_multiloja_request);
			
			//Get Editora -------------------
			document.sf.getEditora(productId, this.process_editora_pdv_request );



			return;
        } else
        //Store the result in produtos_lookup_last_list
        if(/(https:\/\/www\.bling\.com\.br\/services\/produtos\.lookup\.php\?.*)/.test(xhr.responseURL) ){
			
			responseJson = JSON.parse( xhr.response );
	       	productId = this.match_isbn_title_in_list(responseJson['codigo'],responseJson['nome']);      	
			document.sf.getMultilojaPrice(productId, this.process_price_multiloja_request);

        	this.produtos_lookup_last_list = JSON.parse(xhr.response);

        	if(document.querySelector("ui#ui-id-4")){
        		document.querySelector("ui#ui-id-4").onmouseover(this.process_nota_fiscal_by_mouse);
        	}
		} else
		if(/(.*services\/estoques\.server\.php\?f=listarLancamentos.*)/.test(xhr.responseURL) ){
			
			responseJson = document.sf.strToHTML( xhr.response );

			saldo_atual 	= parseInt(responseJson.querySelector( '#saldo_atual_estoque'				 ).innerText.replace('.',''));
			separado 		= parseInt(responseJson.querySelector( '[t="totalEstoque"]>div:nth-child(9)' ).innerText.replace('.',''));
			
			if(saldo_atual<0){
				console.log("under 0") 
				saldo_real = saldo_atual + ( - separado) ;
			}else{
				console.log("0 or above") 
				saldo_real = saldo_atual - separado ;
			}
			
			totais_na_tela = document.querySelector(".totais");

			html_to_show_saldo_real = document.createElement("div");
			html_to_show_saldo_real.classList.add("saldo_real");
			html_to_show_saldo_real.innerHTML = saldo_real;
			
			title_to_show = document.createElement("div");
			title_to_show.classList.add("valor");
			title_to_show.innerHTML = "Valor REAL";
			if(saldo_real<1){
				title_to_show.style = "order:-3;background:red;color:white;width:100%;text-align:center;border-radius:3px 3px 0 0;";
				html_to_show_saldo_real.style = "order:-1;font-size:3em;background:red;color:white;width:100%;text-align: center;";
			}
			else{
				title_to_show.style = "order:-3;background:#285a3c;color:white;width:100%;text-align:center;border-radius:3px 3px 0 0;";
				html_to_show_saldo_real.style = "order:-1;font-size:3em;background:#3faf6c;color:white;width:100%;text-align: center;";
			}

			totais_na_tela.appendChild(html_to_show_saldo_real);
			totais_na_tela.appendChild(title_to_show);
		}
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
	this.popUp_image_name_isbn_stock = function(element){
		document.view.popup();
		if(typeof element == "number" || typeof element == "string"){
			document.sf.getImgById(element, this.process_pop_img_request);
			document.sf.getStockById(element, this.process_pop_stock_request);
			document.sf.getMultilojaPrice(element, this.process_price_multiloja_request);
			document.sf.getEditora(element, this.process_editora_pop_request );
		}else{
			document.sf.getImgById(element.id, this.process_pop_img_request);
			document.sf.getStockById(element.id, this.process_pop_stock_request);
			document.sf.getMultilojaPrice(element.id, this.process_price_multiloja_request);
			document.sf.getEditora(element.id, this.process_editora_pop_request );
		}
	}


	//=======================   HELPERS   ==========================
	//==============================================================
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
		document.addEventListener("keydown", document.back.process_nota_fiscal_popup_by_arrow );
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

} 
document.back = new Back();
document.back.active_popup_on_ui_id_4();


function Front(){
	this.bd = document.querySelector("body");

	//================   On PDV    ===================
	//================================================
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
		
		DOMObj.style = "position:absolute;right:0;width:auto;top:42px;font-size:1.1em;padding-right:15px;";
		DOMObj.classList.add("without-green");
		detalhes_produto = document.querySelector("#detalhes_produto");
		try{
			detalhes_produto.removeChild(detalhes_produto.querySelector(".without-green"));
		}finally{
			detalhes_produto.appendChild(DOMObj);
		}

		//detalhes_produto.appendChild(DOMObj);
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
	this.show_qtd_on_pdv = function(n){
		qtd = document.querySelector("#button_qtd>#qtd");
		qtd.innerHTML = n;
	}


	//=================    POP   =====================
	//================================================
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


	//=================   DELETE   ==================
	//================================================
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
			style.innerHTML = "@media screen and (min-width:900px){ td.context-menu-item{padding-right:50px!important;background:rgba(255,255,255,1);background:-moz-linear-gradient(left,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 53%,rgba(63,174,107,1) 53%,rgba(63,174,107,1) 100%);background:-webkit-gradient(left top,right top,color-stop(0%,rgba(255,255,255,1)),color-stop(53%,rgba(255,255,255,1)),color-stop(53%,rgba(63,174,107,1)),color-stop(100%,rgba(63,174,107,1)));background:-webkit-linear-gradient(left,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 53%,rgba(63,174,107,1) 53%,rgba(63,174,107,1) 100%);background:-o-linear-gradient(left,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 53%,rgba(63,174,107,1) 53%,rgba(63,174,107,1) 100%);background:-ms-linear-gradient(left,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 53%,rgba(63,174,107,1) 53%,rgba(63,174,107,1) 100%);background:linear-gradient(to right,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 53%,rgba(63,174,107,1) 53%,rgba(63,174,107,1) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff',endColorstr='#3fae6b',GradientType=1)} .imagem_produto{max-height:350px!important}} #tabela-saldo-deposito{width:100%;margin:20px 0 0;}tr:nth-child(even){background: white;}table.table-striped{table-layout: auto!important;}"
			document.head.appendChild(style);
		}
	}
} 
front = new Front(); 
document.view = new Front();


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


document.onclick = function(e){
	/*console.log(e.target.parentElement);
	console.log(e.target.parentElement.id);*/
	pop = document.querySelector("#pop_info");
	
	if( /(.*bling\.com\.br\/produtos\.php.*)/.test(document.URL)  && e.target != pop && e.target.parentElement != pop && Number.isInteger(parseInt(e.target.parentElement.id ) ) ){
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

document.back.load_qtd_on_pdv();

document.view.product_green_space_to_click();

style = document.createElement("style");
style.innerHTML = ".imagem_produto{max-height:350px!important} .without-green td, .without-green th{background:white!important;padding-left:0!important;}";
style.innerHTML += "#detalhes_produto #nome_produto{display:contents;}#detalhes_produto #datatable,#detalhes_produto .datatable {padding: 0;width: 31%;} #pop_info > img:hover{width:100%!important;} td[alt='Saldo deste depósito não é considerado'], td[alt='Estoque deste depósito não considerado']{display: none;}#button_qtd:hover>div#qtd{z-index:0!important;margin-left:0!important;}";

$et = "#totalEstoque>.totais>";
$en = "#totalEstoque>.totais>div:nth-child";
style.innerHTML += $et+"h3,"+$en+"(5),"+$en+"(2),"+$en+"(3),"+$en+"(4){display:none;}";

style.innerHTML += ".totais{display:flex;flex-direction:column;}";

document.head.appendChild(style);

$q = function(i){
    return document.querySelector(i);
}
$c = function(i){
    return console.log(i);
}

if ( /(.*Relatório\ detalhado\ de\ Controle\ de\ Caixa.*)/.test( document.querySelector("#base").textContent ) ){
    inner_box_side = document.querySelector(".box-side").innerHTML;
    inner_box_side += `<div class="col s6 offset-s3"><h5 class="white-text">Gerar Relatório</h5><form id="form_81356" class="appnitro" method="post" action="https://18e405oa5e.execute-api.us-east-1.amazonaws.com/dev/sum" target="_blank"><div class="form_description"><p>Preencha corretamente para acessar o resumo.</p></div>            <ul><li id="li_1 white"><label class="description" for="username" hidden="">Usuario </label><div><input id="username" name="username" class="element text small white" type="text" maxlength="255" placeholder="Usuario" value=""> </div> </li>   <li id="li_2"><label class="description" for="password" hidden="">Senha </label><div><input id="password" placeholder="Senha" name="password" class="element text small white" type="password" maxlength="255" value=""> </div> </li>   <li id="li_3"><div class=""><label class="description" for="date" hidden="">Date </label><span><input id="month" name="month" class="element text white col s5" size="2" maxlength="2" step="1" min="1" max="12" placeholder="12" value="12" type="number" style="/* width:40%; *//* margin: 0 0 0 0.57em; */"><label for="month" hidden="" class="active">MM</label></span><span><input id="year" name="year" class="element text white col s6 offset-s1" size="4" step="1" min="2000" max="3000" maxlength="4" placeholder="2019" value="2019" type="Number" style=""><label for="year" hidden="" class="active">YYYY</label></span></div></li><li><input type="hidden" name="form_id" value="81356"><i class="" style=""><i class="waves-button-input buttons btn-large waves-effect waves-light orange darken-4 waves-input-wrapper waves-input-wrapper" style=""><input id="saveForm" class="waves-button-input" type="submit" name="submit" value="Mostrar novo Relatório"></i></i></li></ul></form></div>`;
    document.querySelector(".box-side").innerHTML += inner_box_side;
}

