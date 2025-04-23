function clearGrid(tableName)
{
    var gridObj = $(tableName).retrieve('HtmlTable');

    if (gridObj)
        gridObj.empty();
    else
        $(tableName).getElement('tbody').set('html', '');

    var tableWidth = $(tableName).getSize().x;
    $(tableName).setStyle('width', tableWidth);

    $(tableName).getElements('th').each(function (th) {
        th.setStyles({width: '', display: ''});
    });

    $(tableName).getElement('tbody').setStyles({width: '', display: '', overflow: ''});
    $(tableName).getElement('thead').getElement('tr').setStyles({width: '', display: '', overflow: ''});
}


function PreencheDadosPeloPrefixo(elementoBase, prefixo, listaDados)
{
    Object.each(listaDados, function (value, key)
    {
        elementoBase.getElements('.' + prefixo + '_' + key).each(function (el)     // Texto
        {
            el.set('html', value);
        });

        elementoBase.getElements('.' + prefixo + '_bool_' + key).each(function (el)     // Visibilidade
        {
            if (value)
                el.show();
            else
                el.hide();
        });

        elementoBase.getElements('.' + prefixo + '_dt_' + key).each(function (el)     // Data
        {
            var dt = new Date().parse(value);
            el.set('html', dt.format('%d/%m/%Y'));
        });

        elementoBase.getElements('.' + prefixo + '_ts_' + key).each(function (el)     // Data
        {
            var dt = new Date().parse(value * 1000);
            el.set('html', dt.format('%d/%m/%Y'));
        });

        elementoBase.getElements('.' + prefixo + '_val_' + key).each(function (el)     // Valor Financeiro
        {
            if (value)
                el.set('html', Number.from(value).format({decimals: 2, decimal: ',', group: '.'}));
        });


        elementoBase.getElements('.' + prefixo + '_valR_' + key).each(function (el)     // Valor Financeiro
        {
            if (value)
                el.set('html', 'R$ ' + Number.from(value).format({decimals: 2, decimal: ',', group: '.'}));
        });


        elementoBase.getElements('.' + prefixo + '_val4_' + key).each(function (el)     // Valor Financeiro
        {
            if (value)
                el.set('html', Number.from(value).format({decimals: 4, decimal: ',', group: '.'}));
        });

        elementoBase.getElements('.' + prefixo + '_val6_' + key).each(function (el)     // Valor Financeiro
        {
            if (value)
                el.set('html', Number.from(value).format({decimals: 6, decimal: ',', group: '.'}));
        });
    });
}

function formatarReais(val)
{
    return 'R$ ' + Number.from(val).format({decimals: 2, decimal: ',', group: '.'});
}

function formataPrimeiraMausicula(s)
{
    return s.charAt(0).toUpperCase() + s.substring(1, s.length);
}