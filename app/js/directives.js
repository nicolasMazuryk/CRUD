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
