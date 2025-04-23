$('buscaProdutoPorCodigo').addEvent('hidePanel', function (panelToShow)
{
    if (panelToShow != 'caracteristicas')   // Se for para o painel de Caracteristicas, nao precisa limpar
    {
        $('listaProdutosPorCodigo').empty();
        $('txtCodigoProduto').value = "";
    }
});


window.addEvent('domready', function ()
{
    $('txtCodigoProduto').addEvent('change', txtCodigoProduto_change);
    $('txtCodigoProduto').addEvent('keyup', txtCodigoProduto_change);
    $('txtCodigoProduto').addEvent('focus', txtCodigoProduto_focus);

});

function montaTecladoCodigoProdutos()
{
    var divTeclado = $('tecladoCodigoProduto');

    for (var i = 1; i <= 9; i++)
        criaBotaoTecladoCodigoProdutos(i).inject(divTeclado);

    criaBotaoTecladoCodigoProdutos('.').inject(divTeclado);
    criaBotaoTecladoCodigoProdutos('0').inject(divTeclado);
    criaBotaoTecladoCodigoProdutos('<').inject(divTeclado);

}

function criaBotaoTecladoCodigoProdutos(value)
{
    var btn = new Element("div.botaoTecladoCodigoProduto");
    btn.set("html", value);
    btn.addEvent('click', function ()
    {
        botaoTeclado_click(String.from(value));
    });

    return btn;
}

function botaoTeclado_click(value)
{
//    if (value == 'X')
//        $('txtCodigoProduto').value = '';
    //else 
    if (value == '<')   // Remove o ultimo caractere
        $('txtCodigoProduto').value = $('txtCodigoProduto').value.substring(0, $('txtCodigoProduto').value.length - 1);
    else
        $('txtCodigoProduto').value += value;

    verificaMostraProdutoPorCodigo($('txtCodigoProduto').value);
}

function txtCodigoProduto_change(ev)
{
    verificaMostraProdutoPorCodigo($('txtCodigoProduto').value);
}


function txtCodigoProduto_focus(ev)
{
    $('txtCodigoProduto').value = "";
}

function verificaMostraProdutoPorCodigo(codProduto)
{
    var dadosProduto = App.listaProdutos[codProduto];
    
    if (dadosProduto)
    {
        montaListaProdutos([dadosProduto], $('listaProdutosPorCodigo'));
    }
    else
        $('listaProdutosPorCodigo').empty();
}