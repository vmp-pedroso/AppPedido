// Inicialização do APP e primeiros paines
window.addEvent('domready', function ()
{
    if (loadConfig())
    {   
        if (listaUsuariosAtivos)
        {
            listaUsuariosAtivos();
            showPanel('usuarios');
        }

        if (listaProdutos)
            listaProdutos.delay(300);   // Necessário delay para aumentar a velocidade de carga do APP
    }
    else
    {
        showHideConfig();
    }

});

$('startup-config').addEvent('showPanel', function ()
{
    if (App.config)
    {
        $('ddlConfigProtocol').value = App.config.protocol;
        $('txtConfigServer').value = App.config.server;
        $('txtConfigPort').value = App.config.port;
        $('txtConfigService').value = App.config.service;
        $('txtConfigCodTerminal').value = App.config.codTerminal;
        $('ddlConfigCallFormat').value = App.config.callFormat;
        $('ddlConfigTipoTerminal').value = App.config.tipoTerminal;
        $('ddlConfigMesa').value = (App.config.mesa)?"S":"N";
        $('ddlConfigBalanca').value = App.config.driverBalanca;
        
    }

});


function showHideConfig()
{
    if ($('startup-config').isDisplayed())
        voltarPainelAnterior();
    else
        showPanel('startup-config');
}


function loadConfig()
{
    try
    {
        if (window.localStorage)
        {
            var configString = window.localStorage.getItem('config');

            if (configString)
                App.config = JSON.decode(configString);

            else
                return false;
        }
        else
        {
            // Configuração padrão, se necessário
            App.config = {
                protocol: 'http',
                port: 99,
                server: '192.168.1.20',
                service: 'automat',
                codTerminal: 99,
                tipoTerminal: 'M',
                callFormat: '/',
                mesa: true,
                agruparItens : false,
                driverBalanca : '-'
            };
        }
    }
    catch (e)
    {
        return false;
    }

    apiUrlBase = montaUrlBase(App.config);

    switch (App.config.driverBalanca)
    {
        case 'T':
            App.balanca = new BalancaToledoDriver();
            break;
        
        default:
            App.balanca = new BalancaEmpty();
    }

    return true;
}

// Define a URL da API
function montaUrlBase(config)
{
    if (config.callFormat == 'A')
        return config.protocol + '://' + config.server + ':' + config.port + '/'
                + config.service + '/api.ashx?r=';
    else
        return config.protocol + '://' + config.server + ':' + config.port + '/'
                + config.service + '/';

}

function buscaConfigForm()
{
    return {
        protocol: $('ddlConfigProtocol').value,
        server: $('txtConfigServer').value,
        port: $('txtConfigPort').value,
        service: $('txtConfigService').value,
        codTerminal: $('txtConfigCodTerminal').value,
        tipoTerminal: $('ddlConfigTipoTerminal').value,
        callFormat: $('ddlConfigCallFormat').value,
        mesa: $('ddlConfigMesa').value == 'S',
        agruparItens: $('ddlConfigAgrupar').value == 'S',
        driverBalanca : $('ddlConfigBalanca').value       
    };
}


function saveConfig(config)
{
    // Altera no registro
    if (window.localStorage)
    {
        var configString = JSON.encode(config);
        window.localStorage.setItem('config', configString);
    }

    //Altera para o aplicativo atual
    App.config = config;
    apiUrlBase = montaUrlBase(App.config);

}


function salvarConfiguracao()
{
    // Busca a configuração do Formulario
    var config = buscaConfigForm();

    var login = $('txtConfigLogin').value;
    var pass = $('txtConfigPass').value;
    var terminal = $('txtConfigCodTerminal').value;

    var url = montaUrlBase(config) + 'loginTerminal/' + login + '/' + terminal;
    var jsonData = JSON.encode({login: login, password: pass, terminal: terminal});

    var r = new Request({urlEncoded: false, url: url, emulation: false, onSuccess: salvarConfiguracaoCallback, onFailure: apiErrorCallback});
    Object.append(r.headers, {'Content-Type': 'application/json'});
    r.post(jsonData);

    showLoading();
}

function salvarConfiguracaoCallback(responseText)
{
    hideLoading();

    var jsonData = JSON.decode(responseText);

    if (jsonData && jsonData.bOk)
    {
        saveConfig(buscaConfigForm());  // Busca e salva
        alert('Configurações alteradas com sucesso');

        location.reload();  // Recarregar o app

    }
    else
    {
        alert('Erro ao salvar configurações. Erro interno do Servidor');
    }
}

