'use strict';

/* App Module */

angular.module( 'crudApp', [
    'crudAppControllers',
    'crudAppDirectives',
    //'crudAppFilters',
    'crudAppServices',
    'ngRoute',
    'ngResource',
    'angular-spinkit'
])

    .config( [ '$routeProvider', function ( $routeProvider ) {
        $routeProvider
            .when( '/', {
                templateUrl: 'partials/form.tpl.html',
                controller: 'newsRequestCtrl as news'
            })
            .when( '/saves', {
                templateUrl: 'partials/saves.tpl.html',
                controller: 'savesTplCtrl as saves'
            })
            .otherwise( { redirectTo: '/'} );
    }]);


