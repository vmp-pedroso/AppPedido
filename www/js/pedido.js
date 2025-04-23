function voltarItensPedido()
{
    showPanel('itensPedido');
}

function atualizaToolbarFooter()
{
    var elSpan = new Element('span');

    var elComanda = new Element('span');
    elComanda.set('html', "Comanda: " + App.dadosPedido.cartao);
    elComanda.inject(elSpan);

    if (App.config.mesa)
    {
        var elMesa = new Element('span');
        elMesa.set('html', "Mesa: " + App.dadosPedido.mesa);
        elMesa.inject(elSpan);
    }

    var elUsuario = new Element('span');
    elUsuario.set('html', "Usuario: " + App.selectedUser.userName);
    elUsuario.inject(elSpan);

    $$('.toolbarFooter').each(function (span)
    {
        span.set('html', elSpan.get('html'));
    });
}
