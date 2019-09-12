document.onclick = function(e){
	pop = document.querySelector("#pop_info");
	if( /(.*bling\.com\.br\/produtos\.php.*)/.test(document.URL)  && e.target != pop && e.target.parentElement != pop && e.target.parentElement.parentElement.parentElement.parentElement.parentElement == document.querySelector("#datatable")){
		console.log("This is the element");
		document.back.process_clicked_item(e.target.parentElement);
	}else if(pop){
		pop.parentElement.removeChild(pop);
	}
};