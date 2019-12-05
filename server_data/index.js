

// TCP 테스트 서버 코드
var net_server = require('net');
 
var server = net_server.createServer(function(client) {
  
    console.log('Client connection: ');
    console.log('   local = %s:%s', client.localAddress, client.localPort);
    console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);
    
    client.setTimeout(500);
    client.setEncoding('utf8');
    
    client.on('data', function(data) {
        console.log('Received data from client on port %d: %s', client.remotePort, data.toString());
        console.log('  Bytes sent: ' + client.bytesWritten);
        client.write('i am server!')
    });
    
    client.on('end', function() {
        console.log('Client disconnected');
    });
    
    client.on('error', function(err) {
        console.log('Socket Error: ', JSON.stringify(err));
    });
    
    client.on('timeout', function() {
        console.log('Socket Timed out');
    });
});
 
server.listen(9090, function() {
    console.log('Server listening: ' + JSON.stringify(server.address()));
    server.on('close', function(){
        console.log('Server Terminated');
    });
    server.on('error', function(err){
        console.log('Server Error: ', JSON.stringify(err));
    });
});


const {Database, Tcp, Udp} = require('./connector')

module.exports = function() {
    var db = new Database({
        "type":"mysql",
        "host": "127.0.0.1",
        "user": "root",
        "password": "soul1087",
        "database": "renobit"
    })
    
    db.executeQuery("SELECT * FROM TB_LICENSE").then((rows) => {
        //console.log(rows);
    });

    var tcp = new Tcp({host:"localhost", port:9090})
    tcp.on("data", function(data) {
        console.log(data);
    });
    setInterval(function() {
        tcp.write("i am client");
    },2000)
}();