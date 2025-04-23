var Usuario = new Class({
    
    codUsuario: -1,
    nomeCompleto: "",
    userName: "",
    bAtivo: false,
    
    initialize: function (jsonData)
    {
        this.codUsuario = jsonData["CodUsuario"];
        this.nomeCompleto = jsonData["NomeCompleto"];
        this.userName = jsonData["UserName"].trim();
        this.bAtivo = jsonData["bAtivo"];
    },

});

