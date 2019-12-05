
module.exports = function(config) {
    var event_handlers = {}
    var client = require('net').connect({port:config.port, host:config.host}, function() {
        this.setEncoding(config.encoding ? config.encoding : 'utf8');
        this.setTimeout(config.timeout ? parseInt(config.timeout) : 600000);
    })

    client.on('close', function() {

    })

    client.on('data', function(data) {
        console.log(data);
        if(event_handlers['data']) {
            event_handlers.data.call(data);
        }
    })

    client.on('end', function() { 
        console.log('client Socket End'); 
    }); 
     
    client.on('error', function(err) { 
        console.log('client Socket Error: '+ JSON.stringify(err)); 
    }); 
     
    client.on('timeout', function() { 
        console.log('client Socket timeout: '); 
    }); 
     
    client.on('drain', function() { 
        console.log('client Socket drain: '); 
    }); 
     
    client.on('lookup', function() { 
        console.log('client Socket lookup: '); 
    });

    this.on = function(type, func) {
        event_handlers[type] = func;
        return this;
    }

    this.write = function(data) {
        var success = !client.write(data)
        if(!success) {
            (function(client, data) {
                client.once('drain', function() {
                    this.send(client, data);
                }.bind(this))
            }.bind(this))(client, data)
        }
    }

    return this;
}