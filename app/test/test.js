export default function (message) {

    if (NODE_ENV == 'development') {
        console.log(message);
    }

    var dom = {
        header: $('.container__header'),
        content: $('.container__content'),
        button: $('.container__button'),
        setElem: function (elem) {

            elem.text(message);
        },
        showElem: function ( elem ) {
            elem.css('opacity', 1);
            elem.show();
        },
        changeBg: function (elem) {
            elem.css('background', 'yellow');
        }
    };
    dom.setElem(dom.header);
    dom.showElem(dom.header);

    return dom;
};