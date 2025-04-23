$('pnlProdutos').addEvent('showPanel', function (panelToHide)
{
    // Calcula o tamanho da lista de pedidos
    var contentHeight = $('pnlProdutos').getSize().y;
    var toolHeight = $$('#pnlProdutos div.toolbar')[0].getSize().y;

    var listHeight = contentHeight - toolHeight;

    $('listaProdutos').setStyle('height', listHeight);

});

$('pnlProdutos').addEvent('hidePanel', function (panelToShow)
{
    if (panelToShow != 'caracteristicas')   // Se for para o painel de Caracteristicas, nao precisa limpar
        $('listaProdutos').empty();
});


function montaListaProdutos(lista, container)
{
    container.empty();

    lista.each(function (prod)
    {
        // Clona do Template
        var templateProduto = $('listItemProdutoTemplate').clone();

        PreencheDadosPeloPrefixo(templateProduto, 'produto', prod);


        // Adicona na lista de produto                    
        var itemProduto = new Element('div.itemListaProdutos');
        itemProduto.set('id', 'produto_' + prod.codProduto);
        itemProduto.set('html', templateProduto.get('html'));
        itemProduto.inject(container);

        // Seta a Quantidade
        //itemProduto.getElement('.produto_qtd').set('html', App.dadosPedido.getQuantidadePorProduto(prod.codProduto));
        itemProduto.getElement('.produto_qtd').set('html', 0); // Sempre 0 - Pedido por Osnei - 25/10/2018
        // Guarda os dados do Produto
        itemProduto.store('dadosProduto', prod);

        // Coloca os eventos do + e -
        var links = itemProduto.getElements("a");

        // REGRA - Se o tipo for KG, não mostra botões de adicionar, e sim um campo para digitar o peso
        if (prod.codUnidade == 'KG')
        {
            itemProduto.addClass('itemListaProdutosKg');
            
            links[0].hide();
            links[1].addEvent('click', buscarPesoBalanca);
            if (App.balanca.showIconToGetWeight)
            {
                links[1].show();
                $('imgBalancaDisabled').hide();
            }
            else
            {
                links[1].hide();
                $('imgBalancaDisabled').show('inline');
            }
            
            links[2].addEvent('click', addItemKilo);
            itemProduto.getElements(".produto_qtd")[0].hide();

        }
        else
        {
            $('imgBalancaDisabled').hide();
            links[0].addEvent('click', removerItem);
            links[1].hide();
            links[2].addEvent('click', addItem);
            itemProduto.getElements(".produto_valorKG")[0].hide();
            
        }


    });
//
//    // Verifica se já existem itens desses produtos
//    g_dadosPedido.itens.each(function (item)
//    {
//        incrementaItem(item.produto.CodProduto, item.lista.length);
//    });

}

function addItem(e)
{
    var listItem = new Element(e.target).getParent('div.itemListaProdutos');   // Pega o item da lista
    var dadosProduto = listItem.retrieve('dadosProduto');

    if (dadosProduto.listaCaracteristicas && dadosProduto.listaCaracteristicas.length)
    {
        addItemComCarateristicas(dadosProduto);
    }
    else if (dadosProduto.codUnidade.toUpperCase().trim() == 'PZ')
    {
        addItemPizza(dadosProduto);
    }
    else
    {
        App.dadosPedido.addItem(dadosProduto, 1);
        incrementaItem(dadosProduto.codProduto, 1);
    }
}

function buscarPesoBalanca(e)
{
    var listItem = new Element(e.target).getParent('div.itemListaProdutos');   // Pega o item da lista
    var dadosProduto = listItem.retrieve('dadosProduto');
    var elPeso = listItem.getElements(".produto_valorKG")[0];
    
    App.balanca.getWeigth(setValorKiloCallback.bind({obj: elPeso, data: dadosProduto}));
  
}

function setValorKiloCallback(peso)
{
    this.obj.value = peso; // Number.from(peso).format({decimals: 3, decimal: ',', group: '.'});
    App.balanca.setPrice(this.data.precoUnitario);
    
}

function addItemKilo(e)
{
    var listItem = new Element(e.target).getParent('div.itemListaProdutos');   // Pega o item da lista
    var dadosProduto = listItem.retrieve('dadosProduto');
    var elPeso = listItem.getElements(".produto_valorKG")[0];
    
    var peso = Number.from(elPeso.value.replace(',', '.'));

    if (peso > 0)
    {
        App.dadosPedido.addItem(dadosProduto, peso);
        elPeso.value = "";
    }
}

function incrementaItem(cod, incremento)
{
    var listItem = $('produto_' + cod);
    if (listItem)
    {
        var spanQtd = listItem.getElement('span.produto_qtd');
        var qtd = parseFloat(spanQtd.get('html')) + incremento;
        spanQtd.set('html', qtd);
    }
}

function removerItem(e)
{
    var listItem = new Element(e.target).getParent('div.itemListaProdutos');   // Pega o item da lista
    var produto = listItem.retrieve('dadosProduto');

    // Verifica se existe algum produto desses na lista de produtos
    if (App.dadosPedido.removeItemPorCodProduto(produto.codProduto))
    {
        // Remove da contagem da qtd do produto
        var spanQtd = listItem.getElement('span.produto_qtd');
        var qtd = parseInt(spanQtd.get('html')) - 1;
        spanQtd.set('html', qtd);
    }
}

