$('itensPedido').addEvent('showPanel', function (ev)
{
    verDetalhesPedido();

    // Calcula o tamanho da lista de pedidos
    var contentHeight = $('itensPedido').getSize().y;
    var toolHeight = $$('#itensPedido div.toolbar')[0].getSize().y;
    var footerHeight = $$('#itensPedido div.itensPedidoFooter')[0].getSize().y;

    var listHeight = contentHeight - toolHeight - footerHeight;

    $('listaItensPedido').setStyle('height', listHeight);


});



// Efeito bonitinho
$('pedidoFinalizado').addEvent('showPanel', function (ev)
{
    $('pedidoFinalizado').show('table');    // Para evitar problemas de scroll
    var el = $$('#pedidoFinalizado img')[0];
    el.setStyle('opacity', 0);
    el.set('tween', {duration: 2000});
    el.tween('opacity', 1);
});

// Efeito bonitinho
$('pedidoCancelado').addEvent('showPanel', function (ev)
{
    $('pedidoCancelado').show('table');    // Para evitar problemas de scroll
    var el = $$('#pedidoCancelado img')[0];
    el.setStyle('opacity', 0);
    el.set('tween', {duration: 2000});
    el.tween('opacity', 1);
});

function verDetalhesPedido()
{
    $('listaItensPedido').empty();

    App.dadosPedido.itens.each(function (item, index)
    {
        var itemPedido = montaItemPedido(item);
        itemPedido.inject(('listaItensPedido'));
        itemPedido.store('item', item);
        itemPedido.addEvent('click', itemPedido_click);
    });

    App.dadosPedido.itensPreExistentes.each(function (item)
    {
        var itemPedido = montaItemPedido(item);
        itemPedido.addClass('itemPedidoDetalhesPreExistente');
        itemPedido.inject(('listaItensPedido'));
        itemPedido.store('item', item);
        itemPedido.addEvent('click', itemPedidoPreExistente_click);
    });

    // Coloca o total em R$
    $('detalhesPedido_valorTotal').set('html', formatarReais(App.dadosPedido.calcularValorTotal()));

}


function montaItemPedido(item)
{
    // Clone do Template
    var itemPedido = new Element('div.itemPedidoDetalhes');
    itemPedido.set('html', $('itemPedidoDetalhesTemplate').get('html'));

    // Seta os dados do Pedido
    // Coloca a descricao do Produto
    itemPedido.getElement('.itemPedido_DesProduto').set('html', item.produto.descricao);

    // Coloca a qtd
    if (item.produto.codUnidade == 'KG')
        itemPedido.getElement('.itemPedido_Quantidade').set('html', '-');
    else
        itemPedido.getElement('.itemPedido_Quantidade').set('html', item.quantidade);

    // Coloca o preco
    itemPedido.getElement('.itemPedido_Preco').set('html', formatarReais(item.calcularValorItem()));

    // Coloca as caracteristas
    itemPedido.getElement('.itemPedido_Caracteristicas').set('html', item.getDescCaracteristicas());

    return itemPedido;
}

function itemPedido_click(ev)
{
    var obj = ev.event.currentTarget;
    if (obj)
    {
        if (obj.hasClass('itemPedidoDetalhesSelecionado'))  // ja esta selecionado?
        {
            obj.removeClass('itemPedidoDetalhesSelecionado');   // Sim, desceleciona
        }
        else
        {
            // Desceleciona todo mundo
            $$('#listaItensPedido div.itemPedidoDetalhesSelecionado').each(function (o)
            {
                o.removeClass('itemPedidoDetalhesSelecionado')
            });
            obj.addClass('itemPedidoDetalhesSelecionado');  // Seleciona o obj
        }
    }
}

function itemPedidoPreExistente_click(ev)
{
//    var obj = ev.event.currentTarget;
//    obj.addClass("itemPedidoDetalhesPreExistenteHover");

}


function btnAddNewItem_click()
{
    var selectedElements = $$('#listaItensPedido div.itemPedidoDetalhesSelecionado');
    if (selectedElements.length == 1)   // Se estiver selecionado, mostra ele para adicionar mais
    {
        var item = selectedElements[0].retrieve('item');
        $('txtCodigoProduto').value = item.produto.codProduto;
        verificaMostraProdutoPorCodigo(item.produto.codProduto);
        showPanel('buscaProdutoPorCodigo');
    }
    else
        buscaProduto(App.selectedUser.buscarProdutosPref);
}

function btnRemoveItem_click()
{
    var selectedElements = $$('#listaItensPedido div.itemPedidoDetalhesSelecionado');
    
    if (selectedElements.length == 1)
    {
        var item = selectedElements[0].retrieve('item');
        if (App.dadosPedido.removeItem(item))
        {
            verDetalhesPedido();    // Monta a lista de detalhes do pedido novamente
        }
    }
}


function btnVerItensPedidoFinalizarImprimir_click(e)
{
    if (confirm("Tem certeza que deseja FINALIZAR e IMPRIMIR o pedido?"))
        enviarPedido(true);
}

function btnVerItensPedidoFinalizar_click(e)
{
    if (confirm("Tem certeza que deseja FINALIZAR o pedido?"))
        enviarPedido(false);
}

function btnVerItensPedidoCancelar_click(e)
{
    if (confirm("Tem certeza que deseja CANCELAR o pedido?"))
        cancelarPedido();
}


function buscaProduto(tipoBusca)
{
    if (tipoBusca == 'S') // Search
        showPanel('buscaProdutoPorDescricao');
    else if (tipoBusca == 'C')    // Codigo
        showPanel('buscaProdutoPorCodigo');
    else
        showPanel('buscaProdutoPorGrupo');
}


