'use strict';

/* Directives */

angular.module( 'crudAppDirectives', [])

    .directive( 'likeIcon', function () {
        return {
            restrict: 'E',
            template: "<a class='btn-floating waves-effect waves-light'><i class='material-icons'>grade</i></a>",
            link: function ( scope, elem, attrs ) {
                elem.bind('click', function () {
                    scope.addToSaves(scope.searchItem);
                    elem.find('a').toggleClass('marked');
                })
            }
        }
    })

    .directive( 'readMore', function () {
        return {
            restrict: "E",
            template: "<a class='waves-effect waves-light btn' href='{{searchItem.web_url || searchItem.url}}' target='_blank'>" +
            "<i class='material-icons md-dark right'>launch</i>" +
            "Read more</a>"
        }
    })

    .directive( 'savedItem',[ '$http', 'DataService', function ( $http, DataService ) {
        return {
            restrict: 'A',
            templateUrl: 'partials/card-editable.tpl.html',

            controller: 'savesTplCtrl',
            link: function ( scope, elem, attrs, ctrl ) {
                var current_hashtag, $event_target;

                scope.editorEnabled = {
                    image: false,
                    title: false,
                    byline: false,
                    pub_date: false,
                    summary: false,
                    hashtag: false
                };

                scope.enableEditor = function ( index, item, $event, hashtag_idx ) {
                    $event.stopPropagation();

                    scope.editorEnabled[ item ] = true;
                    current_hashtag = hashtag_idx;
                    $event_target = $event.target;

                    switch ( item ) {
                    case 'image':
                        //scope.editSource = ctrl.results[ index].web_url;
                        scope.editImgUrl = ctrl.results[ index].multimedia[0].url;
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

                scope.disableEditor = function ( item ) {
                    scope.editorEnabled[item] = false;
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
                            ctrl.results[ index].pub_date = ctrl.parseDate(scope.editableField) ;
                            break;
                        case 'summary':
                            ctrl.results[ index].lead_paragraph = scope.editableField;
                            break;
                        case 'hashtag':
                            ctrl.results[ index].keywords[ current_hashtag ].value = scope.editableField;
                            break;
                    }
                    DataService.getData('/saves', 'PUT', JSON.stringify( ctrl.results[index]))
                        .then( function ( res ) {
                        ctrl.results = res.data.saves;
                    });

                    $event_target.innerHTML = scope.editableField;

                    scope.disableEditor( item );
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
