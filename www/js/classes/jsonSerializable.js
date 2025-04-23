var JsonSerializable = new Class({
    
    initialize: function (jsonData)
    {
        Object.each(jsonData, function (value, prop) { this[prop] = value; });
    }
    
});

