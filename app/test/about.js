'use strict';

import about from './test';


let moduleName = location.pathname.slice(1);

let context = require.context('./routes', false, '.js');

let route;

try {
    route = context('./' + moduleName);

} catch (e) {
    alert(e)
}

if (route) {
    route();
}


var module = about('The About Page');

module.setElem( module.header );

module.content.on('mouseover', function () {
    module.changeBg(module.content);
});

