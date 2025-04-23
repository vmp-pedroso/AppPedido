$('buscaProdutoPorGrupo').addEvent('showPanel', function ()
{
    $('listaGrupos').scrollTop = 0;
});

function montaListaGrupos(listaProdutosPorGrupo)
{
    $('listaGrupos').empty();

    listaProdutosPorGrupo.each(function (grupo)
    {
        var itemGrupo = new Element('li');
        var nomeGrupo = new Element('h3');
        var listaSubGrupos = new Element('ul.listaSubGrupos');
        nomeGrupo.set('html', grupo.descricao);
        nomeGrupo.inject(itemGrupo);

        // Monta a lista de subGrupos
        grupo.listaSubGrupos.each(function (subGrupo)
        {
            var itemSubGrupo = new Element('li');
            var linkSubGrupo = new Element('a');

            //customizado inicio
            var nomeSubGrupo = new Element('b');
            var listaSabores = new Element('ul.listaSabores');
            nomeSubGrupo.set('html',subGrupo.descricao);
            nomeSubGrupo.inject(itemSubGrupo);

            if (grupo.nomeGrupo="Pizza"){
                subGrupo.listaSabores.each(function(sabores){
                    var itemSabores = new Element('c');
                    var linkSabores = new Element('d');

                    linkSabores.set('href','javascript:void(0);');
                    linkSabores.addEvent('click',listaSabores);
                    linkSabores.set('html',subGrupo.descricao)
                    // Guarda os dados dos produtos e caracteristicas 
                    linkSabores.store('listaProdutos', subGrupo.listaProdutos);

                    linkSabores.inject(itemSubGrupo);
                    itemSabores.inject(listaSubGrupos);

                });

            }
            else{
                linkSubGrupo.set('href', 'javascript:void(0);');
                linkSubGrupo.addEvent('click', listaProdutosSubGrupo);    // Usar o click para identificar o eventTarget
                linkSubGrupo.set('html', subGrupo.descricao);

                // Guarda os dados dos produtos e caracteristicas 
                linkSubGrupo.store('listaProdutos', subGrupo.listaProdutos);

                linkSubGrupo.inject(itemSubGrupo);
                itemSubGrupo.inject(listaSubGrupos);

            }
            //Customizado Fim
        });

        listaSubGrupos.inject(itemGrupo);

        itemGrupo.inject($('listaGrupos'));

        // Renova o Accordion
        var accordion = new Fx.Accordion($$('#listaGrupos h3'), $$('#listaGrupos ul'));
    });
}


function listaProdutosSubGrupo(e)
{
    var el = new Element(e.target);
    $$('ul.accordian ul li a.selected').each(function (a)
    {
        a.removeClass('selected');
    });

    el.addClass('selected');

    // Preenche a lista de produtos
    montaListaProdutos(el.retrieve('listaProdutos'), $('listaProdutos'));
    showPanel('pnlProdutos');
}

function listaSabores(e)
{
    var el = new Element(e.target);
    $$('ul.accordian ul li a.selected').each(function (a)
    {
        a.removeClass('selected');
    });

    el.addClass('selected');

    // Preenche a lista de produtos
    montaListaProdutos(el.retrieve('listaProdutos'), $('listaProdutos'));
    showPanel('pnlProdutos');
}