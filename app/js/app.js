'use strict';

/* App Module */

angular.module( 'crudApp', [
    'ui.bootstrap',
    'angular-spinkit',
    'crudAppControllers',
    'crudAppDirectives',
    'crudAppServices',
    'ngMaterial',
    'ngRoute',
    'ngResource'
])

    .config( [ '$routeProvider', function ( $routeProvider ) {
        $routeProvider
            .when( '/', {
                templateUrl: 'partials/form.tpl.html',
                controller: 'newsRequestCtrl as news'
            })
            .when( '/categories', {
                templateUrl: 'partials/categories.tpl.html',
                controller: 'newsRequestCtrl as news'
            })
            .when( '/saves', {
                templateUrl: 'partials/saves.tpl.html',
                controller: 'savesTplCtrl as saves'
            })
            .otherwise( { redirectTo: '/'} );
    }]);


