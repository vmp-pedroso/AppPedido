Class.refactor(Request, {
    initialize: function (options) {
        this.previous(options);
        if (!('headers' in options && 'X-Requested-With' in options.headers)) {
            delete this.headers['X-Requested-With'];
        }
        
       // this.options.withCredentials = true;
    }
});
