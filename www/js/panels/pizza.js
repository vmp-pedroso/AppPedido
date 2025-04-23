// Variáveis Globais
var dadosProdutoSelecionarPedacosPizza = null;
var listaSaboresPedacosPizza = {};
var g_listaOpcoesPizza = {'1 Sabor': 1, '2 Sabores': 0.5, '3 Sabores': 0.333, '4 Sabores': 0.25};
var g_listaTamanhoPizza = {'Broto' : 'Broto', 'Média' : 'Média', 'Grande' : 'Grande'}

// Inicializar seleção de PedacosPizza
window.addEvent('domready', function ()
{
    // Coloca os eventos para os botões de PedacosPizza
    $('btnPedacosPizzaCancelar').addEvent('click', btnPedacosPizzaCancelar_click);
    $('btnPedacosPizzaFinalizar').addEvent('click', btnPedacosPizzaFinalizar_click);
});

function addItemPizza(dadosProduto)
{
    dadosProdutoSelecionarPedacosPizza = dadosProduto;
    montaPainelPedacosPizza();
}

function montaPainelPedacosPizza()
{
    $('SubtituloPedacosPizza').set('html', 'Selecione uma opção');

    // Monta a lista de PedacosPizza    
    $('listaItensPedacosPizza').empty()

    Object.each(g_listaOpcoesPizza, function (value, text)
    {
        var item = $('itemPedacosPizzaTemplate').getElement('a').clone();
        item.store('value', value);
        var itemText = item.getElement('span.itemPedacosPizzaTexto');
        itemText.set('html', text);
        item.addEvent('click', selecionarItemPedacosPizza);
        item.inject($('listaItensPedacosPizza'));
    });

    // Necessário colocar um <br clear='all'/>
    var br = new Element('br');
    br.set('clear', 'all');
    br.inject($('listaItensPedacosPizza'));

    showPanel('pizza');
}


function selecionarItemPedacosPizza(e)
{
    var item = new Element(e.target);   // Atraves do Event
    if (item.get('tag') != 'a')
        item = item.getParent('a');     // Garante que o item é o link <a>

    item.getSiblings().each(function (e)
    {
        e.removeClass('itemSelecionado');
    });
    item.addClass('itemSelecionado');
}


function btnPedacosPizzaCancelar_click(e)
{
    voltarPainelAnterior();
}

function btnPedacosPizzaFinalizar_click(e)
{
    var itensSelecionados = $('listaItensPedacosPizza').getElements('a.itemSelecionado');

    // Se não houver pelo menos o mínimo cadastrado, nao muda de passo
    if (itensSelecionados.length == 1)
    {
        var arr = []
        var incremento = itensSelecionados[0].retrieve('value');

        Function.attempt(function ()
        {    // Tenta executar a função
            adicionarPedacoPizza(dadosProdutoSelecionarPedacosPizza, incremento);
        });

        voltarPainelAnterior();
    }
}


function adicionarPedacoPizza(dadosProduto, incremento)
{
    var cod = dadosProduto.CodProduto;
    incrementaItem(cod, incremento);    // Inicialmente coloca

    if (listaSaboresPedacosPizza[cod])
        listaSaboresPedacosPizza[cod].qtd += incremento;
    else
        listaSaboresPedacosPizza[cod] = {produto: dadosProduto, qtd: incremento};

    // soma
    var qtdTotal = 0;
    Object.each(listaSaboresPedacosPizza, function (item)
    {
        qtdTotal += item.qtd;
    });

    // Regra
    if (qtdTotal == 0.99)
        qtdTotal = 1;

    if (qtdTotal > 1)
    {
        alert("Quantidades inválidas para Pizza");
        removePedacosPizza();
    }
    else if (qtdTotal == 1)
    {
        adicionarPizzaPedido();
    }


}


// Remove os pedaços de pizza da tela marcados e zera a lista
function removePedacosPizza()
{
    Object.each(listaSaboresPedacosPizza, function (item)
    {
        incrementaItem(item.produto.CodProduto, -item.qtd); // Decrementa
    });

    listaSaboresPedacosPizza = {};
}

function acharPrecoMaior(lista)
{
    var maiorPreco = 0;

    Object.each(lista, function (item)
    {
        if (item.produto.PrecoUnitario > maiorPreco)
            maiorPreco = item.produto.PrecoUnitario;
    });

    return maiorPreco;
}

function acharPrecoProporcional(lista)
{
    var precoMedio = 0;

    Object.each(lista, function (item)
    {
        precoMedio += item.produto.PrecoUnitario * item.qtd;
    });

    return precoMedio;
}


function adicionarPizzaPedido()
{
    var preco = acharPrecoProporcional(listaSaboresPedacosPizza);
    var dadosPizza = {CodProduto: 0, DesProduto: "Pizza", CodUnidade: "PZ", PrecoUnitario: preco};
    g_dadosPedido.itens.include({produto: dadosPizza, lista: [Object.clone(listaSaboresPedacosPizza)]});

    listaSaboresPedacosPizza = {};  // necessario zerar

    //$('totalConta').set('html', formatarReais(calcularTotalPedido()));
}


function getLinhaPedacosPizza(sabores)
{
    var lista = [];

    Object.each(sabores, function (item)
    {
        lista.include(Object.keyOf(g_listaOpcoesPizza, item.qtd) + " " + item.produto.DesProduto);
    });

    return lista.join(" &nbsp; / &nbsp; ");

} 