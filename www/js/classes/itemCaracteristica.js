var ItemCaracteristica = new Class({
    
    nome: "",
    valor: 0.00,

    initialize: function (jsonData)
    {
        this.nome = jsonData["NomeCaracteristica"];
        this.valor = parseFloat(jsonData["Valor"]);
    },
    
    toJSON : function()
    {
        return { nome: this.nome, valor: this.valor };
    }

});

// Static Methods
ItemCaracteristica.makeList = function (jsonData)
{
    var list = [];
    jsonData.each(function (data)
    {
        list.include(new ItemCaracteristica(data));
    });
    
    return list;
}