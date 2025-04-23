var pnlCaracteristicaController = {
    passo: 0,
    dadosProduto: null,
    listaCaracteristicasSelecionadas: {},
    getCaracteristicasPassoAtual: function ()
    {
        return this.dadosProduto.listaCaracteristicas[this.passo];
    }
};

// Inicializar seleção de caracteristicas
window.addEvent('domready', function ()
{
    // Coloca os eventos para os botões de caracteristicas
    $('btnCaracteristicasAnterior').addEvent('click', btnCaracteristicasAnterior_click);
    $('btnCaracteristicasCancelar').addEvent('click', btnCaracteristicasCancelar_click);
    $('btnCaracteristicasProximo').addEvent('click', btnCaracteristicasProximo_click);
    $('btnCaracteristicasFinalizar').addEvent('click', btnCaracteristicasFinalizar_click);
});


function addItemComCarateristicas(dadosProduto)
{
    pnlCaracteristicaController.passo = 0;    // Iniciar os passos
    pnlCaracteristicaController.listaCaracteristicasSelecionadas = {};
    pnlCaracteristicaController.dadosProduto = dadosProduto;

    montaPainelCaracteristicas();
    showPanel('caracteristicas');
}

function montaPainelCaracteristicas()
{
    // Primeiro passo
    if (pnlCaracteristicaController.passo == 0)
    {
        $('btnCaracteristicasAnterior').hide();
        $('btnCaracteristicasCancelar').show();
    }
    else
    {
        $('btnCaracteristicasAnterior').show();
        $('btnCaracteristicasCancelar').hide();
    }

    // Ultimo Passo
    if (pnlCaracteristicaController.passo == pnlCaracteristicaController.dadosProduto.listaCaracteristicas.length - 1)
    {
        $('btnCaracteristicasProximo').hide();
        $('btnCaracteristicasFinalizar').show();
    }
    else    // Demais passos
    {
        $('btnCaracteristicasProximo').show();
        $('btnCaracteristicasFinalizar').hide();
    }

    // Montar itens no painel
    var caracteristicas = pnlCaracteristicaController.getCaracteristicasPassoAtual();

    if (caracteristicas.max == 1)
        $('SubtituloCaracteristicas').set('html', 'Selecione uma opção');
    else
        $('SubtituloCaracteristicas').set('html', 'Selecione até ' + caracteristicas.max + ' opções');

    // Monta a lista de caracteristicas    
    $('listaItensCaracteristicas').empty();

    caracteristicas.itens.each(function (item)
    {
        var linkItem = $('itemCaracteristicaTemplate').getElement('a').clone();
        linkItem.store('value', item);

        var linkItemText = linkItem.getElement('span.itemCaracteristicaTexto');
        linkItemText.set('html', item.nome);
        
        // Coloca o Preço por caracteristica
        var linkItemPreco = linkItem.getElement('span.itemCaracteristicaPreco');
        if (item.valor > 0)
            linkItemPreco.set('html', "+ " + formatarReais(item.valor));
        else
            linkItemPreco.dispose();

        if (caracteristicas.max == 1 && caracteristicas.min == 1)
            linkItem.addEvent('click', selecionarItemCaracteristicaUnica);
        else
            linkItem.addEvent('click', selecionarItemCaracteristica.bind(caracteristicas.max));

        linkItem.inject($('listaItensCaracteristicas'));
    });

    // Necessário colocar um <br clear='all'/>
    var br = new Element('br');
    br.set('clear', 'all');
    br.inject($('listaItensCaracteristicas'));

}


function selecionarItemCaracteristica(e)
{
    var max = this;  // Atraves do Bind

    var linkItem = new Element(e.target);   // Atraves do Event
    if (linkItem.get('tag') != 'a')
        linkItem = linkItem.getParent('a');     // Garante que o item é o link <a>

    // Se for pra remover sem problemas
    if (linkItem.hasClass('itemSelecionado'))
        linkItem.removeClass('itemSelecionado');
    else
    {
        // Para adicionar primeiro verifica se não chegou no máximo
        if (linkItem.getSiblings('.itemSelecionado').length < max)
            linkItem.addClass('itemSelecionado');
    }
}

function selecionarItemCaracteristicaUnica(e)
{
    var linkItem = new Element(e.target);   // Atraves do Event
    if (linkItem.get('tag') != 'a')
        linkItem = linkItem.getParent('a');     // Garante que o item é o link <a>

    linkItem.getSiblings().each(function (e)
    {
        e.removeClass('itemSelecionado');
    });
    linkItem.addClass('itemSelecionado');
}


function btnCaracteristicasAnterior_click(e)
{
    // Primeiro monta
    pnlCaracteristicaController.passo--;
    montaPainelCaracteristicas();

    // Verifica quais itens estão selecionados
    var indice = pnlCaracteristicaController.getCaracteristicasPassoAtual().Indice;
    $('listaItensCaracteristicas').getElements('a').each(function (e)
    {
        var value = e.retrieve('value');    // Por enquanto
        if (pnlCaracteristicaController.listaCaracteristicasSelecionadas[indice].contains(value))
            e.addClass('itemSelecionado');
        else
            e.removeClass('itemSelecionado');
    });
}

function salvarCaracteristicasSelecionadas()
{
    var caracteristicas = pnlCaracteristicaController.getCaracteristicasPassoAtual();
    var itensSelecionados = $('listaItensCaracteristicas').getElements('a.itemSelecionado');

    // Se não houver pelo menos o mínimo cadastrado, nao muda de passo
    if (itensSelecionados.length >= caracteristicas.min)
    {
        pnlCaracteristicaController.listaCaracteristicasSelecionadas[caracteristicas.indice] = [];
        itensSelecionados.each(function (e)
        {
            pnlCaracteristicaController.listaCaracteristicasSelecionadas[caracteristicas.indice].include(e.retrieve('value'));
        });

        return true;
    }
    else
    {
        return false;
    }
}

function btnCaracteristicasProximo_click(e)
{
    if (salvarCaracteristicasSelecionadas() )
    {
        pnlCaracteristicaController.passo++;
        montaPainelCaracteristicas();
    }
}

function btnCaracteristicasCancelar_click(e)
{
    voltarPainelAnterior();
}

function btnCaracteristicasFinalizar_click(e)
{
    if (salvarCaracteristicasSelecionadas() )
    {
        var listaCaracteristicas = [];
        
        Object.each(pnlCaracteristicaController.listaCaracteristicasSelecionadas, function(itensCaracteristicas)
        {
           listaCaracteristicas.combine(itensCaracteristicas);
        });
        
        App.dadosPedido.addItem(pnlCaracteristicaController.dadosProduto, 1, listaCaracteristicas);
        incrementaItem(pnlCaracteristicaController.dadosProduto.codProduto, 1);
        
        voltarPainelAnterior();
    }
}

