var star = {
    name: 'Jay-z',
    age: 38,
    gender: 'male'
};

var nico = Object.create(star);
nico.prof = 'Web-dev';

Object.defineProperties(nico, { name: {
    writable: true,
    value: 'Nicolas'
},
last_name: {
    value: 'Mazuryk',
    writable: false,
    enumerable: true
}});

for (var prop in nico) {
    console.log( prop + ': ' + nico[prop]);
}

