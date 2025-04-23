$('usuarios').addEvent('showPanel', function ()
{
    $$('header')[0].hide();
    $('usuarios').show('table');    // Para evitar problemas de scroll
    calculateSize();    // Recalcula o tamanho sem o Header

});

$('usuarios').addEvent('hidePanel', function ()
{
    $$('header')[0].show('');
    calculateSize();    // Recalcula o tamanho COM o Header
});

$('ddlUsuarios').addEvent('change', function ()
{
    var cod = $('ddlUsuarios').value;
    $('txtCodUsuario').value = cod;

    if (window.localStorage)
    {
        var pref = window.localStorage.getItem('prefUsuario_BuscarProdutos_' + cod);
        if (pref)
            $('ddlBuscarProdutosPref').value = pref;
    }
});

$('txtCodUsuario').addEvent('keyup', function ()
{
    $('ddlUsuarios').value = $('txtCodUsuario').value;
});


function selecionaUsuario()
{
    App.selectedUser = App.listaUsuarios[$('ddlUsuarios').value];  // Guarda o usuario

    var pref = $('ddlBuscarProdutosPref').value;
    App.selectedUser.buscarProdutosPref = pref;

    if (window.localStorage)
        window.localStorage.setItem('prefUsuario_BuscarProdutos_' + App.selectedUser.codUsuario, pref);

    // TODO:
    // Function.attempt( montaDadosCabecalho );  // Tenta chamar a função do dados do cabeçalho

    // Proximo passo, selecionar comanda e mesa
    showPanel('selecionarComanda');
}


function doLogin()
{
    var user = $('txtUser').value;
    var pass = $('txtPass').value;

    var url = apiUrlBase + "login/" + user;
    var jsonData = JSON.encode({'user': user, 'password': pass});
    var r = new Request({urlEncoded: false, url: url, emulation: false, onSuccess: loginCallback, onFailure: apiErrorCallback});
    Object.append(r.headers, {'Content-Type': 'application/json'});
    r.post(jsonData);
    showLoading();
}

function loginCallback(responseText)
{
    var userData = verificaLoginCallback(responseText);

    if (!userData)  // Todo o resto do processo será feito na outra função.
        alert("Dados de login inválidos");
}

function logout()
{
    var url = apiUrlBase + "logout";
    new Request({url: url, onSuccess: function ()
        {
            location.reload();
        }, onFailure: apiErrorCallback}).get();
    showLoading();
}
