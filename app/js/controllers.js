'use strict';

/* Controllers */

angular.module('crudAppControllers', [])

    .controller('savesTplCtrl', [ '$scope', '$http', function ( $scope, $http) {
        var vm = this;

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
//        vm.deleteItem = function ( index ) {
//console.log( 'delete' );
//            $http.delete( 'http://localhost:4000/likes', {
//                data: index
//            })
//                .then( function ( res ) {
//                    console.log( res );
//                } )
//        }
    }])

    .controller('newsRequestCtrl', [ '$scope', '$http', 'Categories', function ( $scope, $http, Categories) {
        var vm = this;

        $scope.addToSaves = function (event) {

            $http.post('http://localhost:4000/post', JSON.stringify(event))
                .success(function (res) {
                    $scope.storageLength = res.storageLength;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.catagories = Categories;
        console.log( $scope.catagories );

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

        vm.getLastNews = function (query, category) {
            //music.results = requestReview.fetch( function( res ) {
            //    return res.results;
            //});
            var queryEncoded = encodeURIComponent(query),
                api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254',
                url = "http://api.nytimes.com/svc/news/v3/content/all/all?api-key=" +
                    api_key_newswire;

            $http.get(url)
                .success(function (res) {
                    vm.results = res.results;
                }).error(function (error) {
                    console.log(error);
                })
        }
    }])

    .controller('headerIssueCtrl', ['$scope', 'requestReview', 'reviewService', function ($scope, requestReview, reviewService) {
        $scope.data1 = requestReview.fetch(function (res) {
            $scope.results = res.results;
        });
        $scope.data2 = reviewService.fetch;


    }]);
