var ItemComanda = new Class({
    item: 0,
    quantidade: 0, // Apenas para itens pre-existentes
    valorTotal: 0,
    bNovo: false,
    produto: null,
    observacoes: "",
    listaCaracteristicas: [], // Para itens com caracteristiacs

    initialize: function (jsonData)
    {
        if (jsonData)
        {
            this.item = jsonData["Item"];
            this.quantidade = jsonData["Quantidade"];
            this.valorTotal = jsonData["TotalItem"];
            this.bNovo = jsonData["bNovo"];
            this.observacoes = jsonData["Observacoes"];
            this.produto = Produto.factory(jsonData["produto"]);
        }
        else
        {
            this.quantidade = 1;
            this.bNovo = true;
        }
    },
    isSameItem: function (item)
    {
        return (this.produto.codUnidade != 'KG' // Diferente de KG
                && this.produto.codProduto == item.produto.codProduto // Mesmo Produto 
                && JSON.encode(this.listaCaracteristicas).trim() == JSON.encode(item.listaCaracteristicas).trim()); // caracteristicas exatametne iguais
    },
    joinItem: function (item)
    {
        this.quantidade += item.quantidade;
        this.valorTotal += item.valorTotal;
    },
    calcularValorItem: function ()
    {
        var precoTotalItem = 0;
        var precoCaracteristicas = 0;

        if (this.listaCaracteristicas && this.listaCaracteristicas.length > 0)
        {
            this.listaCaracteristicas.each(function (c)
            {
                precoCaracteristicas += c.valor;
            });
        }

        precoTotalItem += this.quantidade * (this.produto.precoUnitario + precoCaracteristicas);

        return parseFloat(precoTotalItem);
    },
    getDescCaracteristicas: function ()
    {
        if (this.produto.codUnidade == 'KG')
        {
            return "+ " + this.quantidade + " Kg";
        }
        else
        {
            if (this.listaCaracteristicas && this.listaCaracteristicas.length > 0)
            {
                var arrNomeCaracteristicas = [];

                this.listaCaracteristicas.each(function (c)
                {
                    arrNomeCaracteristicas.include(c.nome)
                });

                return "- " + arrNomeCaracteristicas.join(" / ");
            }
            else
                return "";
        }
    },
    toJSON: function ()
    {
        var obj = {
            quantidade: this.quantidade,
            valorTotal: this.calcularValorItem(),
            produto: this.produto.toJSON(),
            peso: this.peso,
            listaCaracteristicas: []
        };

        if (this.listaCaracteristicas && this.listaCaracteristicas.length > 0)
        {

            // Adiciona as caracteristicas
            this.listaCaracteristicas.each(function (c)
            {
                obj.listaCaracteristicas.include(c.toJSON())
            });
        }

        return obj;
    }
});

// Static Methods
ItemComanda.makeList = function (jsonData)
{
    var list = [];
    jsonData.each(function (data)
    {
        list.include(new ItemComanda(data));
    });

    return list;
}