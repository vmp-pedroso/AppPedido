$('buscaProdutoPorDescricao').addEvent('showPanel', function (panelToHide)
{
    // Calcula o tamanho da lista de pedidos
    var contentHeight = $('buscaProdutoPorDescricao').getSize().y;
    var toolHeight = $$('#buscaProdutoPorDescricao div.toolbar')[0].getSize().y;
    var searchHeight = $('buscaProdutoPorDescricaoSearch').getSize().y;

    var listHeight = contentHeight - toolHeight - searchHeight;

    $('listaProdutosPorDescricao').setStyle('height', listHeight - 10);

});

$('buscaProdutoPorDescricao').addEvent('hidePanel', function (panelToShow)
{
    if (panelToShow != 'caracteristicas')   // Se for para o painel de Caracteristicas, nao precisa limpar
    {
        $('listaProdutosPorDescricao').empty();
        $('txtSearchProduto').value = "";
    }
});

function searchProduto()
{
    var desc = $('txtSearchProduto').value;
    var lista = [];

    if (desc.length > 1) // Pelo menos 2 caracteres
    {
        desc = desc.trim().toLowerCase();

        App.listaProdutos.each(function (prod)
        {
            if (prod.descricao.trim().toLowerCase().contains(desc))
                lista.include(prod);
        });

        montaListaProdutos(lista, $('listaProdutosPorDescricao'))

    }

}