'use strict';

/* Controllers */

angular.module('crudAppControllers', [])

    .controller('savesTplCtrl', ['$scope', '$http', 'ParseDate', 'PickImage', '$uibModal', function ($scope, $http, ParseDate, PickImage, $uibModal) {
        var vm = this;

        vm.parseDate = ParseDate;
        vm.pickImage = PickImage;
        vm.api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254';
        vm.checkEmpty = function (list) {
            return list[0] !== null;
        };

        $http.get('https://crud-it.herokuapp.com/saves')
            .success(function (data) {

                var data = JSON.parse( data );

                console.log('Data on entry of Saves: ', data );

                vm.hasItems = vm.checkEmpty(data.saves);

                vm.results = data.saves;
                $scope.storageLength = data.storageLength;
            })
            .error(function (error) {
                console.log(error);
            });

        vm.getSpecificArticle = function (path) {

            $http.get('https://api.nytimes.com/svc/news/v3/content?url=' + path + '&api-key=' + vm.api_key_newswire)
                .success(function (res) {
                    console.log(res);
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        vm.removeFromSaved = function (index) {
            var removed = vm.results.splice(index, 1);

            $http.post('https://crud-it.herokuapp.com/remove', JSON.stringify(removed[0])).then(function (res) {
                $scope.storageLength -= 1;
                console.log(res);
            });
        };

        $scope.open = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: './partials/createArticle.tpl.html',
                controller: 'createArticleCtrl as add',
                size: 'md'
            });

            modalInstance.result.then(function (newItem) {
                vm.results.push(newItem);

                $http.post('https://crud-it.herokuapp.com/post', JSON.stringify(newItem))

                    .success(function (res) {
                        $scope.storageLength = res.storageLength;
                    })
                    .error(function (error) {
                        console.log(error);
                    });

            }, function (e) {
                console.log('Modal window throws an error: ' + e);
            });
        };
    }])

    .controller('newsRequestCtrl', ['$scope', '$http', 'Categories', 'ParseDate', 'PickImage', function ($scope, $http, Categories, ParseDate, PickImage) {
        var vm = this;

        vm.parseDate = ParseDate;
        vm.pickImage = PickImage;
        vm.catagories = [];
        $scope.selection = [];
        vm.resultLengthEnabled = false;

        Categories.fetch(function (res) {
            angular.forEach(res.results, function (idx) {
                // delete sections with "." to prevent URL encoding issues
                if (!idx.section.match(/\.+?/g)) {
                    vm.catagories.push(idx);
                }
            });
        });

        vm.pagination = {
            totalItems: 0,
            currentPage: 1,
            setPage: function () {
                console.log(vm.pagination.currentPage);

                if (vm.searchResultView) {
                    vm.getSearchResult();
                } else {
                    vm.getLastNews();
                }
            }
        };
        vm.getSearchResult = function () {
            vm.pagination.currentPage = vm.searchResultView ? vm.pagination.currentPage : 1;

            var api_key_search = '518a9cd9ce5245242456a5c4c29996bc:14:73615254',
                query = encodeURIComponent(vm.formSearch),
                url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
                    query +
                        //"&hl=true" +
                    '&page=' + vm.pagination.currentPage +
                    "&api-key=" +
                    api_key_search;

            $http.get(url)
                .then(function (res) {
                    vm.results = res.data.response.docs;
                    vm.resultsLength = res.data.response.meta.hits;
                    vm.searchResultView = true;
                    vm.resultLengthEnabled = true;
                    vm.pagination.totalItems = res.data.response.meta.hits;
                });
        };

        vm.getLastNews = function () {
            vm.pagination.currentPage = vm.searchResultView ? 1 : vm.pagination.currentPage;

            var api_key_newswire = 'e0f8394cfce0075281d1a3b8423a9d6c:17:73615254',
                section_encoded = [],
                offset = (vm.pagination.currentPage * 20) - 20,
                i = 0,
                l = $scope.selection.length,
                regexp_slash = /\/+?/g,
                regexp_dot = /\.+?/g,
                sections, url, complete_sections;

            for (; i < l; i += 1) {
                section_encoded.push(encodeURI($scope.selection[i]));
            }

            sections = section_encoded.join(';');
            complete_sections = sections.replace(regexp_slash, '%2F').replace(regexp_dot, '%2E');

            url = "https://api.nytimes.com/svc/news/v3/content/all/" +
                complete_sections +
                "?offset=" + offset +
                "&api-key=" +
                api_key_newswire;

            $http.get(url)
                .success(function (res) {
                    vm.results = res.results;
                    vm.searchResultView = false;
                    vm.resultLengthEnabled = true;
                    vm.resultsLength = res.num_results;
                    vm.pagination.totalItems = res.num_results;
                }).error(function (error) {
                    console.log(error);
                })
        };

        $scope.addToSaves = function (event) {

            var StoreItem = function () {
                    this.keywords = [{}];
                    this.headline = {};
                    this.byline = {};

                    this.web_url = event.url;
                    this.multimedia = event.multimedia;
                    this.headline.main = event.title;
                    this.byline.original = event.byline;
                    this.pub_date = event.published_date;
                    this.lead_paragraph = event.abstract;
                    this.keywords[0].value = event.des_facet[0];
                    this.user_ownership = false;
                },

                post_item = event.updated_date ? new StoreItem() : event;

            $http.post('https://crud-it.herokuapp.com/post', JSON.stringify(post_item))

                .success(function (res) {
                    $scope.storageLength = res.storageLength;
                })

                .error(function (error) {
                    console.log(error);
                });
        };
    }])

    .controller('createArticleCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance ) {

        var AddArticle = function () {
            this.multimedia = [{}];
            this.keywords = [{}];
            this.headline = {};
            this.byline = {};

            this.web_url = $scope.newSource;
            this.multimedia[0].url = $scope.newImage;
            this.multimedia[0].width = $scope.newWidth;
            this.multimedia[0].height = $scope.newHeight;
            this.headline.main = $scope.newTitle;
            this.byline.original = $scope.newAuthor;
            this.pub_date = Date.now();
            this.lead_paragraph = $scope.newSummary;
            this.keywords[0].value = $scope.newHashtag;
            this.user_ownership = true;
        };

        $scope.ok = function () {
            $uibModalInstance.close(new AddArticle());
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }])

    .controller('headerIssueCtrl', ['$scope', 'requestReview', 'reviewService', function ($scope, requestReview, reviewService) {
        $scope.data1 = requestReview.fetch(function (res) {
            $scope.results = res.results;
        });
        $scope.data2 = reviewService.fetch;


    }]);
