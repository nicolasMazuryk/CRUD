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
    //.config(['$httpProvider', function($httpProvider) {
    //    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //    //$httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    //    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    //    //$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    //    //$httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    //    //$httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    //    //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    //    //$httpProvider.defaults.useXDomain = true;
    //}])

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


