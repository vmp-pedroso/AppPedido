var Caracteristica = new Class({
    indice: 0,
    min: 0,
    max: 0,
    itens: [],

    initialize: function (jsonData)
    {
        this.indice = jsonData["Indice"];
        this.min = jsonData["Minimo"];
        this.max = jsonData["Maximo"];
        this.itens = ItemCaracteristica.makeList(jsonData["Itens"]);
    },
   
});

// Static Methods
Caracteristica.makeList = function (jsonData)
{
    var list = [];
    jsonData.each(function (data)
    {
        list.include(new Caracteristica(data));
    });
    
    return list;
}