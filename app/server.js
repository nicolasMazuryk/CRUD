var http = require('http'),
    fs = require('fs'),
    database = require( './database.json'),
    port = process.env.PORT || 4000,
    host = process.env.HOST || '0.0.0.0',
    storage,
    server,

    DatabaseInit = function () {

        this.storageLength = database.storageLength ?
            database.storageLength : 0;

        this.likes = database.likes ?
            database.likes : [];
    };

storage = new DatabaseInit();


server = new http.Server(function( req, res ) {

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE');

    if (req.url == '/likes') {
        res.statusCode = 200;
        res.end( JSON.stringify( storage ) );
    }

    req.on('data', function (data) {

        storage.likes[ storage.storageLength ] = JSON.parse( data.toString());

        storage.storageLength += 1;

        fs.writeFile( 'database.json', JSON.stringify( storage ) );

        res.statusCode = 200;
        res.end( JSON.stringify( storage ) );
    });

    req.on('end', function() {
        res.statusCode = 200;
        res.end( 'End success' );
    });
});

server.listen(port, host, function() {
    console.log('Server running at ' + host + ':' + port);
});