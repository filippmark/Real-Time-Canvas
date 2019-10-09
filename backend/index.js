let WebSocketServer = require('websocket').server;
let http = require('http');
 
let server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
    return true;
}

let connections = [];

let figures = [];
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    let connection = request.accept();
    connection.send(JSON.stringify(figures));
    connections.push(connection);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        figures.push(message.utf8Data);
        connections.forEach(connection => {
            connection.send(JSON.stringify(figures));
        });
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});