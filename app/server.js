var http = require('http'),
    fs = require('fs'),
    database = require( './database.json'),
    port = process.env.PORT || 4000,
    host = process.env.HOST || '0.0.0.0',
    storage,
    server,

    DatabaseInit = function () {
        var arr_length = 1;

        this.storageLength = database.storageLength ?
            database.srotageLength : 0;

        this.likes = database.likes ?
            database.likes : new Array( arr_length );
    };

    storage = new DatabaseInit();

server = new http.Server(function( req, res ) {
    var requestCount = 0;

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE');

    if (req.url == '/likes') {
        res.statusCode = 200;
        res.end( JSON.stringify( storage ) );

        console.log( 'Likes arr have sent: ' + ++requestCount );
    }



    req.on('data', function (data) {
        var parsed = JSON.parse( data.toString()),
            index = storage.storageLength;

        //storage.storageLength += 1;
        storage.likes[ index ] = parsed;

        fs.writeFile( 'database.json', JSON.stringify( storage ) );

        res.statusCode = 200;
        res.end('The item has been added to Liked Items');

        console.log( 'Items have been posted: ' + ++requestCount );
    });

    req.on('end', function() {
        res.statusCode = 200;
        res.end( 'Response from server side success. ');
    });
});

server.listen(port, host, function() {
    console.log('Server running at ' + host + ':' + port);
});