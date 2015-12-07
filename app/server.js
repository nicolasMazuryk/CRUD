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

        this.saves = database.saves ?
            database.saves : [];
    };

storage = new DatabaseInit();


server = new http.Server(function( req, res ) {

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE');

    if (req.url == '/saves') {
        res.statusCode = 200;
        res.end( JSON.stringify( storage ) );
    } else if ( req.url == '/edit') {

        req.on( 'data', function ( data ) {
            var edited = JSON.parse( data.toString() );

            for (var i = 0, l = storage.storageLength; i < l; i += 1 ) {
                if (storage.saves[i]._id === edited._id ) {
                    storage.saves[ i ] = edited;
                    break;
                }
            }
            fs.writeFile( 'database.json', JSON.stringify( storage ) );

            res.statusCode = 200;
            res.end( JSON.stringify( storage ) );

        });

        req.on('end', function() {
            res.statusCode = 200;
            res.end( 'End success' );
        });

    } else if ( req.url == '/remove' ) {

        req.on( 'data', function ( data ) {
            var removed = JSON.parse( data.toString() );

            for (var i = 0, l = storage.storageLength; i < l; i += 1 ) {
                if (storage.saves[i]._id === removed._id ) {
                    storage.saves.splice( i, 1 );
                    storage.storageLength -= 1;
                    break;
                }
            }
            fs.writeFile( 'database.json', JSON.stringify( storage ) );

            res.statusCode = 200;
            res.end( JSON.stringify( storage ) );

        });

        req.on('end', function() {
            res.statusCode = 200;
            res.end( 'End success' );
        });

    } else if ( req.url == '/post' ) {
        req.on('data', function (data) {

            storage.saves[ storage.storageLength ] = JSON.parse( data.toString());

            storage.storageLength += 1;

            fs.writeFile( 'database.json', JSON.stringify( storage ) );

            res.statusCode = 200;
            res.end( JSON.stringify( storage ) );
        });

        req.on('end', function() {
            res.statusCode = 200;
            res.end( 'End success' );
        });
    }

});

server.listen(port, host, function() {
    console.log('Server running at ' + host + ':' + port);
});