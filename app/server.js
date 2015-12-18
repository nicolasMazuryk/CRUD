var http = require('http'),
    fs = require('fs'),
    qs = require('querystring'),
    database = require( './database.json'),
    path = require('path'),
    mime = require('mime'),
    port = process.env.PORT || 4000,
    host = process.env.HOST || '0.0.0.0',
    storage,
    req_body = '',
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

        console.log('Json.stringify(storage) from server /saves: ', JSON.stringify( storage ) );

        res.end( JSON.stringify( storage ) );
    } else if ( req.url == '/edit') {

        req.on( 'data', function ( data ) {
            var edited = qs.parse( data.toString() );

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
            var removed = qs.parse( data.toString() );

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

        var body = '';

        req.on('data', function (data) {

            body += data;

            console.log('Chunks: ', body );

        });

        req.on('end', function() {

            var data = qs.parse( body );

            storage.saves[ storage.storageLength ] = data;


            console.log( "Parsed data: ", data );
            console.log( "Storage.saves: ", storage.saves );

            storage.storageLength += 1;

            fs.writeFile( 'database.json', JSON.stringify( storage ) );

            res.statusCode = 200;
            res.end( JSON.stringify( storage ) );
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