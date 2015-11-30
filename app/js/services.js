'use strict';

/* Services */

angular.module( 'crudAppServices', [ 'ngResource'])

    .factory( 'ipService', [ '$resource', function( $resource ) {
        return $resource( 'http://jsonip.com', {}, {
            query: { method: 'GET' }
        })
    }])

    .factory( 'Categories', ['$http', function ( $http ) {
        var api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254';


        return $http.get('http://api.nytimes.com/svc/news/v3/content/section-list?api-key=' + api_key_newswire )
            .success( function ( res ) {
                return res.results;
            })
            .error( function ( error ) {
                console.log( error );
            });
    }])

    .service('requestReview', ['$resource', '$http',

        function ($resource) {


            return $resource("http://localhost:1337/itunes.apple.com/search?term=:query", {query: '' }, {
                fetch: {
                    method: 'GET',
                    params: {},
                    headers: {
                        'Accept': 'application/json, text/javascript',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    isArray: false
                    //callback: 'JSON_CALLBACK'
                }
            });
        }])

    .factory('reviewService', ['$http',

    function ($http) {
        //$http.defaults.useXDomain = true;
        //delete $http.defaults.headers.common['X-Requested-With'];

        return {
            fetch: function (params) {
                var p = {};
                for (var attrname in defaultParams) {
                    p[attrname] = defaultParams[attrname];
                }
                for (var attrname in params) {
                    p[attrname] = params[attrname];
                }
                return $http({
                    method: "GET",
                    params: {},
                    url: "http://localhost:1337/itunes.apple.com/search?term=jack+johnson",
                    headers: {
                        'Accept': 'application/json, text/javascript',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    //callback: 'JSON_CALLBACK',
                    isArray: false
                });
            }
        }
    }]);

