var BalancaToledoDriver = new Class(
{
    Binds: [
        'errorCallback', 'connectSerial', 'assertConnection',
        'globalReadCallback', 'getWeigth', 'setPrice'
    ],
    
    initialize: function ()
    {
        this.isConnected = false;
        this.setPriceTries = 0;
        this.getWeightTries = 0;
        this.responseCallback = null;
        this.rxBuffer = [];
        this.showIconToGetWeight = true;
    },
    errorCallback: function (message)// private
    {
        alert('Error: ' + message);
        //this.closeSerial();
        this.isConnected = false;
    },
    
    requestPermissionErrorCallback: function (message)// private
    {
        alert('Error: ' + message);
    },
    
    connectSerial: function (callback) // private
    {
        var requestPermitionFunction = function (successMessage)
        {
            var openSerialFunction = function()
            {
                this.isConnected = true;
                serial.registerReadCallback(this.globalReadCallback, this.errorCallback);
                callback();
            };
            
            serial.open({baudRate: 9600}, openSerialFunction.bind(this) , this.errorCallback);
        };
        
        serial.requestPermission( requestPermitionFunction.bind(this), this.requestPermissionErrorCallback);
    },
    
    globalReadCallback: function (data)
    {
        if (this.responseCallback != null)
        {
            this.responseCallback(new Uint8Array(data));
        }
    },
    
    assertConnection: function (callback) // private
    {
        if (!this.isConnected)
        {
            this.connectSerial(callback);
        }
        else
        {
            callback();
        }

    },
    
    closeSerial: function () //private
    {
        serial.close(function (successMessage)
        {}, this.errorCallback);
        this.isConnected = false;
    },
    
    sayHello: function ()
    {
        return "Balanca Toledo Driver";
    },
       
    
    getWeigth: function (callbackFunction) // public
    {
        var getWeightResponseCallBack = function (dataArray)
        {
            var strWeight = '';

            for (var i = 0; i < dataArray.length; i++)
            {
                if (dataArray[i] >= '0'.charCodeAt(0) && dataArray[i] <= '9'.charCodeAt(0))
                {
                    strWeight += String.fromCharCode(dataArray[i]);
                }
            }
            //                
    //                var hex = '';
    //                for (var i = 0; i < dataArray.length; i++)
    //                {
    //                    hex += dataArray[i].toString(16) + ' ';
    //                }
    //                alert("getWeigth Received Hex: " + hex + "- strWeight: " + strWeight);// + " - wieght: " + weight);

            if (strWeight.length == 5)  // Chegou direitinho
            {
                var weight = parseFloat(strWeight) / 1000;
                if (weight != NaN)
                {
                    callbackFunction(weight);
                }
                this.responseCallback = null;        // Não chama novamente
            }
            else
            {
                if (this.getWeightTries++ < 10)
                {
                    this.getWeigth(callbackFunction);   // Try Again
                }
                else
                {
                    //alert("Erro ao buscar preço na balança");
                    this.getWeightTries = 0;  // Forget and Reset
                    this.responseCallback = null;
                }
            }

        };

        var getWeigthFunction = function ()
        {
            this.responseCallback = getWeightResponseCallBack.bind(this);
            serial.writeHex('05', null, this.errorCallback);
        };
    
        this.assertConnection(getWeigthFunction.bind(this));
    },
    
    setPrice: function (price) //public
    {
        var setPriceResponseCallback = function (dataArray)
        {
//                var hex = '';
//                for (var i = 0; i < dataArray.length; i++)
//                {
//                    hex += dataArray[i].toString(16) + ' ';
//                }
//                alert("setPrice Received Hex: " + hex);

            if (dataArray.length == 1 && dataArray[0].toString(16) == '6') // Correto
            {
                this.setPriceTries = 0;
                this.responseCallback = null;
            }
            else
            {
                if (this.setPriceTries++ < 10)
                {
                    this.setPrice(price);    // Try Again
                }
                else
                {
                    this.setPriceTries = 0;  // Forget and Reset
                    this.responseCallback = null;
                }
            }

        };
        
        var setPriceFunction = function ()
        {
            var strPrice = ("000000" + Math.floor(price * 100)).slice(-6);
            //alert(strPrice);

            var hex = '02'; // Start With 02h

            for (var i = 0; i < strPrice.length; i++)
            {
                hex += strPrice.charCodeAt(i).toString(16);
            }

            hex += '03'; // ENd with 03h

            this.responseCallback = setPriceResponseCallback.bind(this);
            serial.writeHex(hex, null, this.errorCallback);
        };

        this.assertConnection(setPriceFunction.bind(this));
    },
    
    writeHex: function (data) //public - FOR DEBUG
    {
        // alert('try');
        this.assertConnection(function ()
        {
            // alert('connected');

            this.responseCallback = function (dataArray)
            {
                var hex = '';
                for (var i = 0; i < dataArray.length; i++)
                {
                    hex += dataArray[i].toString(16);
                }

                // alert("Received Hex: " + hex);
            };

            serial.writeHex(data, function (successMessage)
            {
                // alert("writeHex Success: " + successMessage);

            }, this.errorCallback);
        });
    }

});
