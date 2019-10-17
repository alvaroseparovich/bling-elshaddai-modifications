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
			style.innerHTML = "@media screen and (min-width:900px){ #datatable table.table-striped tbody tr td div.input-checkbox {padding-left: 45px;background:rgba(63,175,108,1);background:linear-gradient(to right,rgba(63,175,108,1) 0,rgba(63,175,108,1) 47%,rgba(63,175,108,0) 47%,rgba(63,175,108,0) 48%,rgba(255,255,255,0) 49%,rgba(255,255,255,0) 100%); height: 24px;} .imagem_produto{max-height:350px!important} table tbody td:first-child{padding-left:40px;}}"
			document.head.appendChild(style);
		}
	}
} 
front = new Front(); 
document.view = new Front();
