'use strict';

/* Controllers */

angular.module('crudAppControllers', [])

    .controller('rootCtrl', ['$scope', '$http', function ($scope, $http) {
        //$scope.storageLength = 0;
    }])

    .controller('likesTplCtrl', [ '$scope', '$http', function ( $scope, $http) {
        var vm = this;

        vm.checkEmpty = function (list) {
            return list[0] !== null;
        };

        $http.get('http://localhost:4000/likes')
            .success(function (data) {
                vm.hasItems = vm.checkEmpty(data.likes);

                vm.results = data.likes;
                $scope.storageLength = data.storageLength;
            })
            .error(function (error) {
                console.log(error);
            });
    }])

    .controller('newsRequestCtrl', [ '$scope', '$http', 'Categories', function ( $scope, $http, Categories) {
        var music = this;

        $scope.addToLiked = function (event) {

            $http.post('http://localhost:4000/post', JSON.stringify(event))
                .success(function (res) {
                    console.log(res.storageLength);

                    $scope.storageLength = res.storageLength;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.catagories = Categories;

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

        this.iTunes = function (query, category) {
            //music.results = requestReview.fetch( function( res ) {
            //    return res.results;
            //});
            var queryEncoded = encodeURIComponent(query),
                url = "http://localhost:1337/itunes.apple.com/search?term=" +
                    queryEncoded +
                    '&media=' + category +
                    '&entity=album' +
                    '&limit=20';

            $http.get(url)
                .success(function (res) {
                    music.results = res.results;
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
