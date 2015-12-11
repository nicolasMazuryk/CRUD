'use strict';

/* Services */

angular.module( 'crudAppServices', [ 'ngResource'])

    .service( 'PickImage', function() {
        var sizeSettings = {
            'thumbnail': 75,
            'wide': 190,
            'xlarge': 440
            },
            domain = 'http://www.nytimes.com/';

        return function ( arr, size ) {

            for (var i = 0, l = arr.length; i < l; i += 1) {
                if (sizeSettings[ size ] === arr[ i ].width ) {
                    arr[i].url = arr[i].url.slice(0, 23) === domain ? arr[i].url : domain + arr[i].url;
                    return arr[ i ];

                } else if ( size === 'xlarge' && sizeSettings[ size ] < arr[ i ].width) {
                    arr[i].url = arr[i].url.slice(0, 23) === domain ? arr[i].url : domain + arr[i].url;
                    return arr[ i ];
                }
            }
        }
    })

    .service( 'ParseDate', function () {

        return function ( date ) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Now', 'Dec'],
                publish_date = new Date( date),
                month = months[ publish_date.getMonth() ],
                days = publish_date.getDate(),
                hours = publish_date.getHours(),
                mins = publish_date.getMinutes();

            return month + ' ' + days + ' at ' + toCorrectTime( hours ) + ':' + toCorrectTime( mins );
        };

        function toCorrectTime( time ) {
            if ( time.toString().length !== 2 ) {
                return '0' + time;
            }
            return time;
        }
    })

    .factory( 'Categories', ['$resource', function ( $resource ) {
        var api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254';

        return $resource('https://api.nytimes.com/svc/news/v3/content/section-list?api-key=' + api_key_newswire, {}, {
            fetch: {
                method: 'GET',
                params: {},
                isArray: false
            }
        });
    }]);

    //.service('requestReview', ['$resource', '$http',
    //
    //    function ($resource) {
    //        return $resource("http://localhost:1337/itunes.apple.com/search?term=:query", {query: '' }, {
    //            fetch: {
    //                method: 'GET',
    //                params: {},
    //                headers: {
    //                    'Accept': 'application/json, text/javascript',
    //                    'Content-Type': 'application/json; charset=utf-8'
    //                },
    //                isArray: false
    //                //callback: 'JSON_CALLBACK'
    //            }
    //        });
    //    }])
    //
    //.factory('reviewService', ['$http',
    //
    //function ($http) {
    //    //$http.defaults.useXDomain = true;
    //    //delete $http.defaults.headers.common['X-Requested-With'];
    //
    //    return {
    //        fetch: function (params) {
    //            var p = {};
    //            for (var attrname in defaultParams) {
    //                p[attrname] = defaultParams[attrname];
    //            }
    //            for (var attrname in params) {
    //                p[attrname] = params[attrname];
    //            }
    //            return $http({
    //                method: "GET",
    //                params: {},
    //                url: "http://localhost:1337/itunes.apple.com/search?term=jack+johnson",
    //                headers: {
    //                    'Accept': 'application/json, text/javascript',
    //                    'Content-Type': 'application/json; charset=utf-8'
    //                },
    //                //callback: 'JSON_CALLBACK',
    //                isArray: false
    //            });
    //        }
    //    }
    //}]);

