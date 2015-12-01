'use strict';

/* Controllers */

angular.module('crudAppControllers', [])

    .controller('savesTplCtrl', [ '$scope', '$http', function ( $scope, $http) {
        var vm = this;

        vm.api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254';

        vm.checkEmpty = function (list) {
            return list[0] !== null;
        };

        $http.get('http://localhost:4000/saves')
            .success(function (data) {
                vm.hasItems = vm.checkEmpty(data.saves);

                vm.results = data.saves;
                $scope.storageLength = data.storageLength;
            })
            .error(function (error) {
                console.log(error);
            });

        vm.getSpecificArticle = function ( path ) {

            $http.get( 'http://api.nytimes.com/svc/news/v3/content?url=' + path + '&api-key=' + vm.api_key_newswire )
                .success( function ( res ) {
                    console.log( res );
                })
                .error( function ( error ) {
                    console.log( error );
                });
        }

    }])

    .controller('newsRequestCtrl', [ '$scope', '$http', 'Categories', function ( $scope, $http, Categories) {
        var vm = this;

        $scope.selection = [];

        Categories.fetch( function ( res ) {
            vm.catagories = res.results;
        });

        vm.getSearchResult = function () {
            var api_key_search = '518a9cd9ce5245242456a5c4c29996bc:14:73615254',
                query = encodeURIComponent( vm.formSearch),

                url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
                    query +
                    //"&fq=news_desk:(" +
                    //')' +
                    "&api-key=" +
                    api_key_search;

            $http.get( url )
                .then( function ( res ) {
                    console.log( res );
                })


        };

        vm.getLastNews = function () {
            var api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254',
                sections = '',
                i = 0,
                l = $scope.selection.length,
                section_encoded, url;

            for (; i < l; i += 1 ) {
                section_encoded = encodeURI( $scope.selection[i] );
                sections = sections.concat( section_encoded, ';');
            }
            console.log( sections );

            url = "http://api.nytimes.com/svc/news/v3/content/all/" +
                sections +
                "?api-key=" +
                api_key_newswire;

console.log( url );
            $http.get(url)
                .success(function (res) {
                    vm.results = res.results;
                }).error(function (error) {
                    console.log(error);
                })
        };

        $scope.addToSaves = function (event) {

            $http.post('http://localhost:4000/post', JSON.stringify(event))

                .success(function (res) {
                    $scope.storageLength = res.storageLength;
                })

                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.getIp = function () {
            $http.get('http://jsonip.com')
                .success(function (res) {
                    $scope.userIP = res.ip;
                });
        };

        $scope.googleSpreadsheetDB = function () {
            $http.get('https://spreadsheets.google.com/feeds/list/1fkwuxv7qZtfELBEr6q10dQaYxxssiyoQ2M3UoTYvYDk/od6/public/values?alt=json')
                .success(function (res) {
                    $scope.spreadsheetKey = res.feed.entry[0].gsx$column.$t;
                    $scope.spreadsheetValue = res.feed.entry[0].gsx$desc.$t;
                })
        };
    }])

    .controller('headerIssueCtrl', ['$scope', 'requestReview', 'reviewService', function ($scope, requestReview, reviewService) {
        $scope.data1 = requestReview.fetch(function (res) {
            $scope.results = res.results;
        });
        $scope.data2 = reviewService.fetch;


    }]);
