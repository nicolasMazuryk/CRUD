'use strict';

/* Services */

angular.module( 'crudAppServices', [ 'ngResource'])

    .factory( 'ipService', [ '$resource', function( $resource ) {
        return $resource( 'http://jsonip.com', {}, {
            query: { method: 'GET' }
        })
    }])

    .factory( 'Categories', function () {
        return [ "all", "movie", "podcast", "music", "musicVideo", "audiobook", "shortFilm", "tvShow", "software", "ebook"];
    })

    .service('requestReview', ['$resource', '$http',

        function ($resource) {


            return $resource("http://localhost:1337/itunes.apple.com/search?term=:query", {query: this.urlEncoded }, {
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

