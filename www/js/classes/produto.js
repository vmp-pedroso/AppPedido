var Produto = new Class({
    codProduto: 0,
    codUnidade: "",
    descricao: "",
    precoUnitario: 0.00,
    listaCaracteristicas: [],
    
     toJSON : function()
    {
        return { 
            codProduto: this.codProduto,
            codUnidade: this.codUnidade,
            descricao: this.descricao,
            precoUnitario: this.precoUnitario
        };
    }
});

// Static Methods
Produto.factory = function (jsonData, characteristicList)
{
    var cod = jsonData["CodProduto"].trim();

    if (App.listaProdutos && App.listaProdutos[cod])
        return App.listaProdutos[cod];

    var obj = new Produto();
    obj.codProduto = cod;
    obj.codUnidade = jsonData["CodUnidade"];
    obj.descricao = jsonData["DesProduto"];
    obj.precoUnitario = parseFloat(jsonData["PrecoUnitario"]);
    obj.listaCaracteristicas = characteristicList;
    
    return obj;
}

