// Variaveis auxiliares
var imgdir = 'img/';

var loadingSpinner;


window.addEvent('domready', function ()
{
    Locale.use('pt-BR');

    calculateSize();

    // loading Content - Startup tem q ser o ultimo
    var panelList = ['usuarios', 'selecionarComanda', 'itensPedido', 'pnlProdutos', 'caracteristicas', 'pizza',
        'buscaProdutoPorCodigo', 'buscaProdutoPorGrupo', 'buscaProdutoPorDescricao', 'startup-config'];


    // Carrega todos os paineis
    panelList.each(function (pnlName)
    {
        var div = new Element("div.appContent");
        div.inject($('content'));
        div.id = pnlName;

        // Carrega o HTML do painel
        div.load("panels/" + pnlName + ".html");

        // Carrega o Script do painel
        Asset.javascript("js/panels/" + pnlName + ".js")
    });
    
});

window.onerror = function (err)
{
    alert("Erro: " + err);
};

// Calcula o tamanho dos paineis principais
function calculateSize()
{
    var windowHeight = window.getSize().y;
    var headerHeight = $$('header')[0].getSize().y;
    var footerHeight = $$('footer')[0].getSize().y;

    var sectionSize = windowHeight - headerHeight - footerHeight;

    $('content').setStyle('height', sectionSize);
}

var panelStack = [];

function showHidePanels(panelToHide, panelToShow)
{
    if (panelToHide)
    {
        $(panelToHide).hide();
        $(panelToHide).fireEvent('hidePanel', panelToShow);
    }
    $(panelToShow).show();
    $(panelToShow).fireEvent('showPanel', panelToHide);

}

function showPanel(panel)
{
    var painelAnterior = panelStack.getLast(); // pega sem remover
    showHidePanels(painelAnterior, panel);

    panelStack.push(panel); // Adiciona na pilha

    // Proteção: guarda somente os ultimos 64 itens
    while (panelStack.length > 64)
        panelStack.shift(); // remove o elemento mais antigo
}

function voltarPainelAnterior()
{
    var painelAtual = panelStack.pop();
    var painelAnterior = panelStack.getLast(); // sem Remover
    showHidePanels(painelAtual, painelAnterior);
}

function voltarEstadoInicial()
{
    // Limpa os pedidos
    App.dadosPedido = {};

    if (App.config.tipoTerminal == 'M')
    {
        App.selectedUser = null;
        showPanel('usuarios');
    }
    else
        showPanel('selecionarComanda');
}

function hideAllPanels()
{
    Object.each($$('div.appContent'), function (obj)
    {
        try
        {
            obj.hide();
        }
        catch (e)
        {
        }
    });
}


function showLoading()
{
    if (loadingSpinner)
        hideLoading();

    loadingSpinner = new Spinner($$('body')[0], {
        containerPosition: {relativeTo: $$('body')[0], position: 'center'},
        content: $('carregando'),
        img: false
    });

    loadingSpinner.show(true);
}


function hideLoading()
{
    if (loadingSpinner)
        loadingSpinner.hide(true);
}

