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