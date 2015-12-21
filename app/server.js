var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    database = require( './database.json'),
    //path = require('path'),
    port = process.env.PORT || 4000,
    host = process.env.HOST || '0.0.0.0',
    storage,
    app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function ( req, res, next ) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});


var DatabaseInit = function () {
    this.storageLength = database.storageLength ? database.storageLength : 0;

    this.saves = database.saves ? database.saves : [];
};

storage = new DatabaseInit();


app.get('/', function (req, res, next ) {

    res.sendfile(__dirname + '/index.html');

});

app.post('/', function ( req, res, next ) {
    var data = req.body;

    storage.saves[storage.storageLength] = data;


    console.log( "Parsed data: ", data );
    console.log( "Storage.saves: ", storage.saves );

    storage.storageLength += 1;

    fs.writeFile( 'database.json', JSON.stringify( storage ) );

    res.send( JSON.stringify( storage ));
});

app.get('/saves', function ( req, res, next ) {

    res.send( JSON.stringify( storage ));

});

app.put('/saves', function ( req, res, next ) {
    var edited = req.body;
//
    for (var i = 0, l = storage.storageLength; i < l; i += 1 ) {
        if (storage.saves[i]._id === edited._id ) {
            storage.saves[ i ] = edited;
            break;
        }
    }
    fs.writeFile( 'database.json', JSON.stringify( storage ) );

    res.send( JSON.stringify(storage));
});

app.delete('/saves', function ( req, res, next ) {
    var removed = req.body;

    for (var i = 0, l = storage.storageLength; i < l; i += 1 ) {
        if (storage.saves[i]._id === removed._id ) {
            storage.saves.splice( i, 1 );
            storage.storageLength -= 1;
            break;
        }
    }

    fs.writeFile( 'database.json', JSON.stringify( storage ) );
    res.send('Removed!');
});


var server = app.listen(port, function () {
    var host = server.address().address;

    console.log('Server listening at http://' + host + ':' + port);
});


//
//
//server = new http.Server(function( req, res ) {
//    //console.log( req.headers.origin);
//    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE');
//
//    if (req.url == '/') {
//
//        fs.readFile( path.join(__dirname, 'index.html') , function ( err, data ) {
//            if ( err ) {
//                res.statusCode = 404;
//                res.end('The browser cannot load the page from server. Sorry for that');
//            }
//
//            res.writeHead(200, {"Content-Type": mime.lookup(path.basename((path.join(__dirname, 'index.html'))))});
//            res.end( data );
//        });
//
//    } else if (req.url == '/saves') {
//
//        res.statusCode = 200;
//        res.end( JSON.stringify( storage ) );
//
//    } else if ( req.url == '/edit') {
//
//        var body = '';
//
//        req.on( 'data', function ( data ) {
//
//            body += data;
//
//        });
//
//        req.on('end', function() {
//
//            var edited = JSON.parse( body );
//
//            for (var i = 0, l = storage.storageLength; i < l; i += 1 ) {
//                if (storage.saves[i]._id === edited._id ) {
//                    storage.saves[ i ] = edited;
//                    break;
//                }
//            }
//            fs.writeFile( 'database.json', JSON.stringify( storage ) );
//
//            res.statusCode = 200;
//            res.end( JSON.stringify( storage ) );
//        });
//
//    } else if ( req.url == '/remove' ) {
//
//        var body = '';
//
//        req.on( 'data', function ( data ) {
//            body += data;
//
//        });
//
//        req.on('end', function() {
//
//            var removed = JSON.parse( body );
//
//            for (var i = 0, l = storage.storageLength; i < l; i += 1 ) {
//                if (storage.saves[i]._id === removed._id ) {
//                    storage.saves.splice( i, 1 );
//                    storage.storageLength -= 1;
//                    break;
//                }
//            }
//            fs.writeFile( 'database.json', JSON.stringify( storage ) );
//
//            res.statusCode = 200;
//            res.end( JSON.stringify( storage ) );
//        });
//
//    } else if ( req.url == '/post' ) {
//
//        body = '';
//
//        req.on('data', function (data) {
//
//            body += data;
//
//        });
//
//        req.on('end', function() {
//
//            var data = JSON.parse( body );
//
//            storage.saves[storage.storageLength] = data;
//
//
//            console.log( "Parsed data: ", data );
//            console.log( "Storage.saves: ", storage.saves );
//
//            storage.storageLength += 1;
//
//            fs.writeFile( 'database.json', JSON.stringify( storage ) );
//
//            res.statusCode = 200;
//            res.end( JSON.stringify( storage ) );
//        });
//    } else {
//        fs.readFile( path.join(__dirname, './' + req.url) , function ( err, data ) {
//            if ( err ) {
//                res.statusCode = 404;
//                res.end('The browser cannot load the page from server. Sorry for that');
//            } else {
//                res.writeHead(200, {"Content-Type": mime.lookup(path.basename((path.join(__dirname, './' + req.url))))});
//                res.end( data );
//            }
//        });
//    }
//
//});
//
//server.listen(port, host, function() {
//    console.log('Server running at ' + host + ':' + port);
//});