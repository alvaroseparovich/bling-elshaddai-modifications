function Back(){
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

		arrTxt1 = arrTxt.substr(24,arrTxt.search(/, 0\)]]>/)-24);
		if(arrTxt1){
			 arrEditoras = JSON.parse(arrTxt1);
			}else{
			arrTxt = arrTxt.substr(24,arrTxt.search(/, 0, 1\)]]>/)-24);
			arrEditoras = JSON.parse(arrTxt);
		}

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
			saldo_atual 	= parseInt(document.querySelector( '#saldo-geral > .totais > .info-value:nth-child(6)').innerText.replace('.',''));
			try{separado 	= parseInt(document.querySelector( '#saldo-geral > .totais > div > .info-value' ).innerText.replace('.',''));}
			catch{separado = 0}
			
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
