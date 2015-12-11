var http = require('http'),
    fs = require('fs'),
    database = require( './database.json'),
    path = require('path'),
    mime = require('mime'),
    port = process.env.PORT || 4000,
    host = process.env.HOST || '0.0.0.0',
    storage,
    server;

var DatabaseInit = function () {

        this.storageLength = database.storageLength ?
            database.storageLength : 0;

        this.saves = database.saves ?
            database.saves : [];
    };

storage = new DatabaseInit();


server = new http.Server(function( req, res ) {
    //console.log( req.headers.origin);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE');

    if (req.url == '/') {
        fs.readFile( path.join(__dirname, 'index.html') , function ( err, data ) {
            if ( err ) {
                res.statusCode = 404;
                res.end('The browser cannot load the page from server. Sorry for that');
            }

            res.writeHead(200, {"Content-Type": mime.lookup(path.basename((path.join(__dirname, 'index.html'))))});
            res.end( data );
        });
    } else if (req.url == '/saves') {
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
            //console.log('Length: ', storage.storageLength );
            //console.log('data to string: ', data.toString());
            //console.log('JSON.parse data.toString: ', JSON.parse(data.toString()));

            storage.saves[ storage.storageLength ] = JSON.parse( data );

            storage.storageLength += 1;

            fs.writeFile( 'database.json', JSON.stringify( storage ) );

            res.statusCode = 200;
            res.end( JSON.stringify( storage ) );
        });

        req.on('end', function() {
            res.statusCode = 200;
            res.end( 'End success' );
        });
    } else {
        fs.readFile( path.join(__dirname, './' + req.url) , function ( err, data ) {
            if ( err ) {
                res.statusCode = 404;
                res.end('The browser cannot load the page from server. Sorry for that');
            } else {
                res.writeHead(200, {"Content-Type": mime.lookup(path.basename((path.join(__dirname, './' + req.url))))});
                res.end( data );
            }
        });
    }

});

server.listen(port, host, function() {
    console.log('Server running at ' + host + ':' + port);
});