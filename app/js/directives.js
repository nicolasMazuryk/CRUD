'use strict';

/* Directives */

angular.module( 'crudAppDirectives', [])

    .directive('routeLoadingIndicator', [ '$rootScope', function ( $rootScope ) {
        return {
            restrict: 'A',
            template: '<div ng-show="isRouteLoading" class="loading-indicator">' +
            '<div class="loading-indicator-body">' +
            '<div class="spinner"><rotating-plane-spinner>' +
            '</rotating-plane-spinner>' +
            '</div>' +
            '</div>' +
            '</div>',
            replace: true,
            link: function ( scope, element ) {
                scope.isRouteLoading = false;

                $rootScope.$on( '$routeChangeStart', function () {
                    scope.isRouteLoading = true;
                    element.show();
                });

                $rootScope.$on( '$routeChangeSuccess', function () {
                    scope.isRouteLoading = false;
                    element.hide();
                });
            }
        }
    }] )

    .directive( 'savedItem',[ '$http', function ( $http ) {
        return {
            restrict: 'A',
            template:
                // href={{searchItem.web_url}}
            '<a href="" ng-click="enableEditor( $index, \'image\' )" ng-hide="editorEnabled.image" ng-if="searchItem.multimedia[0]">' +
                '<img src="{{saves.nyt_domain + searchItem.multimedia[0].url}}" width="{{searchItem.multimedia[0].width}}" height="{{searchItem.multimedia[0].height}}" alt=""/>' +
            '</a>' +
            '<div ng-show="editorEnabled.image">' +
                '<input type="text" ng-model="editSource" />' +
                '<input type="text" ng-model="editImgUrl" />' +
                '<input type="text" ng-model="editWidth" />' +
                '<input type="text" ng-model="editHeight" />' +
                '<button ng-click="save($index, \'image\')">Save</button>' +
                '<button ng-click="disableEditor( \'image\' )">Cancel</button>' +
            '</div>' +

            '<h2 class="article__heading" ng-click="enableEditor( $index, \'title\' )" ng-hide="editorEnabled.title">{{searchItem.headline.main}}</h2>' +
            '<div ng-show="editorEnabled.title">' +
                '<input type="text" ng-model="editableField" />' +
                '<button ng-click="save($index, \'title\')">Save</button>' +
                '<button ng-click="disableEditor( \'title\' )">Cancel</button>' +
            '</div>' +

            '<p class="byline" ng-click="enableEditor( $index, \'byline\' )" ng-hide="editorEnabled.byline">{{searchItem.byline.original}}</p>' +
            '<span class="update-date" ng-click="enableEditor( $index, \'pub_date\' )" ng-hide="editorEnabled.pub_date"> {{saves.parseDate(searchItem.pub_date)}}</span>' +

            '<div ng-show="editorEnabled.byline">' +
                '<input type="text" ng-model="editableField" />' +
                '<button ng-click="save($index, \'byline\')">Save</button>' +
                '<button ng-click="disableEditor( \'byline\' )">Cancel</button>' +
            '</div>' +

            '<div ng-show="editorEnabled.pub_date">' +
                '<input type="text" ng-model="editableField" />' +
                '<button ng-click="save($index, \'pub_date\')">Save</button>' +
                '<button ng-click="disableEditor( \'pub_date\' )">Cancel</button>' +
            '</div>' +

            '<p class="summary" ng-click="enableEditor( $index, \'summary\' )" ng-hide="editorEnabled.summary">{{searchItem.lead_paragraph}}</p>' +

            '<div ng-show="editorEnabled.summary">' +
                '<textarea ng-model="editableField"></textarea>' +
                '<button ng-click="save($index, \'summary\')">Save</button>' +
                '<button ng-click="disableEditor( \'summary\' )">Cancel</button>' +
            '</div>' +

            '<span class="hashtag" ng-click="enableEditor( $parent.$index, \'hashtag\', key )" ng-hide="editorEnabled.hashtag" ng-repeat="(key, val) in searchItem.keywords">#{{val.value}} </span>' +

            '<div ng-show="editorEnabled.hashtag">' +
                '<input type="text" ng-model="editableField" />' +
                '<button ng-click="save( $index, \'hashtag\' )">Save</button>' +
                '<button ng-click="disableEditor( \'hashtag\' )">Cancel</button>' +
            '</div>' +
            '<button class="btn btn-default" ng-click="saves.removeFromSaved($index)">Remove</button>',

            controller: 'savesTplCtrl',
            link: function ( scope, elem, attrs, ctrl ) {
                var current_hashtag;

                scope.editorEnabled = {
                    image: false,
                    title: false,
                    byline: false,
                    pub_date: false,
                    summary: false,
                    hashtag: false
                };

                scope.enableEditor = function ( index, item, hashtag_idx ) {
                    current_hashtag = hashtag_idx;
                    scope.editorEnabled[ item ] = true;

                    switch ( item ) {
                    case 'image':
                        scope.editSource = ctrl.results[ index].web_url;
                        scope.editImgUrl = ctrl.results[ index].multimedia[0].url;
                        scope.editWidth = ctrl.results[ index].multimedia[0].width;
                        scope.editHeight = ctrl.results[ index].multimedia[0].height;
                        break;
                    case 'title':
                        scope.editableField = ctrl.results[ index].headline.main;
                            break;
                    case 'byline':
                        scope.editableField = ctrl.results[ index].byline.original;
                            break;
                    case 'pub_date':
                        scope.editableField = ctrl.results[ index].pub_date;
                            break;
                    case 'summary':
                        scope.editableField = ctrl.results[ index].lead_paragraph;
                            break;
                    case 'hashtag':
                        scope.editableField = ctrl.results[ index].keywords[ hashtag_idx].value;
                    }
                };

                scope.save = function ( index, item ) {

                    switch ( item ) {
                        case 'image':
                            ctrl.results[ index].web_url = scope.editSource;
                            ctrl.results[ index].multimedia[0].url = scope.editImgUrl;
                            ctrl.results[ index].multimedia[0].width = scope.editWidth;
                            ctrl.results[ index].multimedia[0].height = scope.editHeight;
                            break;
                        case 'title':
                            ctrl.results[ index].headline.main = scope.editableField;
                            break;
                        case 'byline':
                            ctrl.results[ index].byline.original = scope.editableField;
                            break;
                        case 'pub_date':
                            ctrl.results[ index].pub_date = scope.editableField;
                            break;
                        case 'summary':
                            ctrl.results[ index].lead_paragraph = scope.editableField;
                            break;
                        case 'hashtag':
                            ctrl.results[ index].keywords[ current_hashtag ].value = scope.editableField;
                            break;
                    }

                    scope.disableEditor( item );
                    $http.post( 'http://localhost:4000/edit', JSON.stringify( ctrl.results[index])).then( function ( res ) {
                        console.log( ctrl.results );
                        console.log( res.data.saves );

                        ctrl.results = res.data.saves;

                    });

                };

                scope.disableEditor = function ( item ) {
                    scope.editorEnabled[item] = false;
                };

            }
        }
    }])

    .directive( 'checkboxGroup', function() {
        return {
            restrict: 'A',
            link: function ( scope, elem, attrs, ctrl ) {

                elem.bind('click', function () {

                    var index = scope.selection.indexOf( attrs.value );

                    if ( index === -1 ) {

                        scope.selection.push( attrs.value );

                    } else {

                        scope.selection.splice( index, 1 );

                    }
                })
            }
        }
    })

    .directive( 'loader', [ '$http', function ( $http ) {
        return {
            restrict: 'A',
            template: '<div ng-show="isLoading">' +
                '<rotating-plane-spinner></rotating-plane-spinner>' +
                '<div class="loading-indicator"></div>' +
                '</div>',
            replace: true,
            link: function ( scope, elem ) {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.setBusyCursor = function( enable ) {
                    enable ? window.document.body.style.cursor = "wait" :
                        window.document.body.style.cursor = 'auto' ;
                };

                scope.$watch( scope.isLoading, function ( loading ) {
                    if ( loading ) {
                        elem.show();
                        scope.setBusyCursor( true );
                    } else {
                        elem.hide();
                        scope.setBusyCursor( false );
                    }

                } );
            }
        }
    }]);
