document.onclick = function(e){
	console.log(e.target.parentElement);
	console.log(e.target.parentElement.id);
	pop = document.querySelector("#pop_info");
	
	if( /(.*bling\.com\.br\/produtos\.php.*)/.test(document.URL)  && e.target != pop && e.target.parentElement != pop && Number.isInteger(parseInt(e.target.parentElement.id ) ) ){
		console.log("This is the element");
		document.back.process_clicked_item(e.target.parentElement);
	}else if(pop){
		pop.parentElement.removeChild(pop);
	}
};