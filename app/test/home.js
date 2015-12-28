'use strict';

import welcome from './test';

var module = welcome('Nicolas Mazuryk');

module.setElem( module.header );

//module.button.on('click', function () {
//
//    require.ensure(['./login'], function (require) { // or just require.ensure([], func)
//        let login = require('./routes/login');
//
//        login();
//    }, 'auth');
//
//    module.showElem(module.content);
//
//});

//module.header.on('click', function () {
//    require.ensure([], function (require) {
//        let logout = require('./routes/logout');
//
//        logout();
//    }, 'auth');
//});

