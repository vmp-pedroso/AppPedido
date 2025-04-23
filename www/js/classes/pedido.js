var Pedido = new Class({
    
    cartao: 0,
    mesa: 0,
    codUsuario: 0,
    codTerminal: 0,
    itens: [],
    itensPreExistentes: [],
    itensPorCodigoProduto: {},
    
    initialize: function (jsonData)
    {
        this.cartao = jsonData["Cartao"];
        this.mesa = jsonData["Mesa"];
        this.codUsuario = jsonData["CodUsuario"];
        this.codTerminal = jsonData["CodTerminal"];
        this.itensPreExistentes = ItemComanda.makeList(jsonData["Itens"]);
    },
    
    addItem: function (dadosProduto, quantidade, listaCaracteristicas)
    {
        listaCaracteristicas = listaCaracteristicas || {}; // Optional Parameter
        var item = new ItemComanda();
        item.produto = dadosProduto;
        item.quantidade = quantidade;
        item.listaCaracteristicas = listaCaracteristicas;

        this.includeItem(item)

        return item;
    },
    
    includeItem: function (item)
    {
        var codProduto = item.produto.codProduto;
        var arrItens = this.itensPorCodigoProduto[codProduto] || [];

        // Verifica se o item ja existe na lista
        var itemExistente = null;
        arrItens.each(function (i)
        {
            if (i.isSameItem(item))
                itemExistente = i;
        });

        if (App.config.agruparItens && itemExistente)
        {
            itemExistente.joinItem(item);
        }
        else
        {
            this.itens.include(item);
            arrItens.include(item);
            this.itensPorCodigoProduto[codProduto] = arrItens;
        }
    },
    
    removeItem: function (item)
    {
        this.itens.erase(item);
        var arrItens = this.itensPorCodigoProduto[item.produto.codProduto] || [];
        arrItens.erase(item);    // Remove da lista de itens por produto
        return true;
    },
    
    removeItemPorCodProduto: function (codProduto)
    {
        var arrItens = this.itensPorCodigoProduto[codProduto] || [];
        if (arrItens.length > 0)
        {
            // Decrementa ou remove se necessário
            var item = arrItens.getLast();
            item.quantidade--;
            if (item.quantidade == 0)
                this.removeItem(item);

            return true;
        }
        else
        {
            return false;
        }
    },
    
    getQuantidadePorProduto: function (codProduto)
    {
        var qtd = 0;
        var arrItens = this.itensPorCodigoProduto[codProduto] || [];
        arrItens.each(function (i)
        {
            qtd += i.quantidade;
        });
        return qtd;
    },
    
    calcularValorTotal: function ()
    {
        var precoTotal = 0;

        this.itensPreExistentes.each(function (itemPedido)
        {
            precoTotal += itemPedido.calcularValorItem();
        });

        this.itens.each(function (itemPedido)
        {
            precoTotal += itemPedido.calcularValorItem();
        });

        return precoTotal;
    },
    
    itensToJSON: function ()
    {
        var jsonItens = [];
        this.itens.each(function (itemPedido)
        {
            jsonItens.include(itemPedido.toJSON());
        });

        return jsonItens;
    }

});
