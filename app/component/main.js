
require.ensure([], function (require) {

    let Menu = require('./menu');

    let customMenu = new Menu({
        title: 'Some title',
        items: [{
            text: 'text',
            href: '#item1'
        }, {
            text: 'text + text',
            href: '#item2'
        }, {
            text: 'text in square',
            href: '#item3'
        }]

    });

    document.body.appendChild( customMenu.elem );
})