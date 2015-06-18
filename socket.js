/**
 * Created by liqi on 2015/6/17.
 */
var app=require('http').createServer(handler),
    io=require('socket.io').listen(app),
    fs=require('fs')
;

app.listen(8080);
//io.set('log level','1');

function handler (req, res) {
    fs.readFile(__dirname + '/socket.html',function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

var sockets=[],i=0;
io.sockets.on('connection', function (socket) {
    sockets[i]=socket;
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});