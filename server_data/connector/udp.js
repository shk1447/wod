

module.exports = function(config) {
    var host = config.host;
    var port = config.port;

    var client = require('dgram');

    this.send = function(message) {
        client.send(message, 0, message.length, port, host, function(err, bytes) {
            if(err) throw err;
            client.close();
        })
    }

    return this;
}