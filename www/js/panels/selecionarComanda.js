$('selecionarComanda').addEvent('showPanel', function (ev)
{
    $('selecionarComanda').show('table');    // Para evitar problemas de scroll

    $('txtNomeUsuario').value = App.selectedUser.userName;
    $('txtCodTerminal').value = App.config.codTerminal;
    $('txtComanda').value = "";
    $('txtMesa').value = "";

    // REGRA - Pode não ser necessario utilizar/ selecionar mesa
    if (App.config.mesa)
        $('fieldMesa').show();
    else
        $('fieldMesa').hide();

});


// Verificar e chamar Login
window.addEvent('domready', function ()
{
    //alert(1);
});


function voltarParaSelecaoUsuario()
{
    showPanel('usuarios');
}