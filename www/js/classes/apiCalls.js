var apiUrlBase;

function apiErrorCallback(h)
{
    hideLoading();

    if (h.status == 0)
        alert("Servidor '" + App.config.server + "' não encontrado\nVerifique a conexão e as configurações do servidor e serviço " + App.config.service + ".");
    else if (h.status == 404)
        alert("Serviço '" + App.config.service + "' não encontrado\nVerifique as configurações do aplicativo.");
    else
    {
        var jsonData = JSON.decode(h.responseText);
        if (jsonData)
            alert(jsonData.errorMessage + " (" + jsonData.httpStatusCode + ")");
        else
            alert("Erro: " + h.status + " - " + h.responseText);
    }
}


function listaProdutos()
{
    var url = apiUrlBase + "listaProdutos";
    new Request({url: url, onSuccess: listaProdutosCallback, onFailure: apiErrorCallback}).get();
}

function listaProdutosCallback(responseText)
{
    var jsonData = JSON.decode(responseText);
    var listaGrupos = [];
    var lstsabor = [{DesSabor:"1 Sabor",Qtde:"1"},{DesSabor:"2 Sabores",Qtde:"0.5"},{DesSabor:"3 Sabores",Qtde:"0.333"},{DesSabor:"4 Sabores",Qtde:"0.25"}];

    // Monta a lista de produtos
    jsonData.each(function (jsonGrupo)
    {
        var grupo = {descricao : jsonGrupo.DesGrupo, listaSubGrupos: []};
        
        jsonGrupo.listaSubGrupos.each(function (jsonSubGrupo)
        {
            //console.log ("subgrupo",JSON.stringify(jsonSubGrupo));
            //console.log ("data",JSON.stringify(jsonData));
            var und = jsonSubGrupo.listaProdutos[0].CodUnidade;
            var listaCaracteristicas = Caracteristica.makeList(jsonSubGrupo.listaCaracteristicas);

            if (und=="PZ"){
                var subGrupo = {descricao: jsonSubGrupo.DesSubGrupo, listaSabores : []};
                for (var i = 0; i < 4; i++){

                    var sabores = {descricao: lstsabor[i].DesSabor, Qtde: lstsabor[i].Qtde,listaProdutos:[]};
                    
                    jsonSubGrupo.listaProdutos.each(function (jsonProduto)
                    {
                        var produto = Produto.factory(jsonProduto, listaCaracteristicas);
                        App.listaProdutos[produto.codProduto] = produto;
                        sabores.listaProdutos.include(produto);
                    });
                    subGrupo.listaSabores.include(sabores);
                }
            }
            else{
                var subGrupo = {descricao: jsonSubGrupo.DesSubGrupo, listaProdutos : []};
                jsonSubGrupo.listaProdutos.each(function (jsonProduto)
                {
                    var produto = Produto.factory(jsonProduto, listaCaracteristicas);
                    App.listaProdutos[produto.codProduto] = produto;
                    subGrupo.listaProdutos.include(produto);
                });

            }
            
            grupo.listaSubGrupos.include(subGrupo);
        });
        
        listaGrupos.include(grupo);
    });

    // Preenche a lista dos grupos
    montaListaGrupos(listaGrupos);
    
}

function listaUsuariosAtivos()
{
    var url = apiUrlBase + "listaUsuariosAtivos";
    new Request({url: url, onSuccess: listaUsuariosAtivosCallback, onFailure: apiErrorCallback}).get();

    showLoading();
}

function listaUsuariosAtivosCallback(responseText)
{
    hideLoading();

    var jsonData = JSON.decode(responseText);

    if (jsonData)
    {
        // Limpa o ComboBox
        $('ddlUsuarios').getElements('option').each(function (opt)
        {
            opt.dispose();
        });

        jsonData.each(function (jsonUser)
        {
            var user = new Usuario(jsonUser);
            
            App.listaUsuarios[user.codUsuario] = user;
            var opt = new Element('option', {value: user.codUsuario, html: user.userName});
            opt.inject($('ddlUsuarios'));
        });

        //força o reload
        $('ddlUsuarios').fireEvent('change');

        return jsonData;
    }
}

function iniciarPedido()
{
    var comanda = $('txtComanda').value;
    var mesa = $('txtMesa').value;

    // Define os dados da chamada que serão sempre padrão
    var dadosChamada = comanda + "/" + mesa + "/" + App.selectedUser.codUsuario + "/" + App.config.codTerminal + "/";

    var url = apiUrlBase + "iniciaPedido/" + dadosChamada;
    new Request({url: url, onSuccess: iniciarPedidoCallback, onFailure: apiErrorCallback}).get();
    showLoading();
}

function iniciarPedidoCallback(responseText)
{
    var jsonData = JSON.decode(responseText);

    if (instanceOf(jsonData, String))  // Houve algum erro
        alert(jsonData);
    else
    {
        App.dadosPedido = new Pedido( jsonData );

        atualizaToolbarFooter();
        showPanel('itensPedido');
    }

    hideLoading();
}

function enviarPedido(bImprimir)
{
    var dadosChamada = App.dadosPedido.cartao + "/" + App.dadosPedido.mesa + "/" + App.selectedUser.codUsuario + "/" + App.config.codTerminal + "/";
    var url = apiUrlBase + "finalizarPedido/" + dadosChamada + ((bImprimir) ? "S" : "N");
    var jsonData = JSON.encode(App.dadosPedido.itensToJSON());

    var r = new Request({urlEncoded: false, url: url, emulation: false, onSuccess: enviarPedidoCallback, onFailure: apiErrorCallback});
    Object.append(r.headers, {'Content-Type': 'application/json'});
    r.post(jsonData);

    showLoading();
}

function enviarPedidoCallback(responseText)
{
    hideLoading();
    var bOk = JSON.decode(responseText);

    if (bOk)
    {
        showPanel('pedidoFinalizado');
//        voltarEstadoInicialPedido();
    }
    else
    {
        alert("Houve algum erro ao enviar o pedido");
    }
}

function cancelarPedido()
{
    var dadosChamada = App.dadosPedido.cartao + "/" + App.dadosPedido.cartao + "/" + App.selectedUser.codUsuario + "/" + App.config.codTerminal + "/";
    var url = apiUrlBase + "cancelaPedido/" + dadosChamada
    new Request({url: url, onSuccess: cancelarPedidoCallback, onFailure: apiErrorCallback}).get();
    showLoading();
}

function cancelarPedidoCallback(responseText)
{
    hideLoading();
    App.dadosPedido = {}
    showPanel('pedidoCancelado');
}

