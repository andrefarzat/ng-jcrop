/* global angular:true */
(function(angular) {
        'use strict';

        angular.module('ngJcrop', [])


        .constant('ngJcropTemplate',
                '<div class="ng-jcrop">' +
                '    <div class="ng-jcrop-image-wrapper">' +
                '        <img class="ng-jcrop-image" />' +
                '   </div>' +
                '   <div class="ng-jcrop-thumbnail-wrapper" ng-style="previewImgStyle">' +
                '       <img class="ng-jcrop-thumbnail" />' +
                '   </div>' +
                '</div>'
        )


        .run(['$window', function($window) {
                if (!$window.jQuery) {
                        throw new Error("jQuery isn't included");
                }

                if (!$window.jQuery.Jcrop) {
                        throw new Error("Jcrop isn't included");
                }
        }])

        .directive('ngJcrop', ['ngJcropTemplate', function(ngJcropTemplate) {

                return {
                        restrict: 'A',
                        scope: {
                                imageSrc: '=',
                                thumbnail: '=',
                                selection: '=',
                                config: '='
                        },
                        template: ngJcropTemplate,
                        controller: 'JcropController'
                };

        }])

        .directive('ngJcropInput', function() {

                return {
                        restrict: 'A',
                        controller: 'JcropInputController'
                };

        })

        .controller('JcropInputController', ['$rootScope', '$element', '$scope',
                function($rootScope, $element, $scope) {

                        if ($element[0].type !== 'file') {
                                throw new Error('ngJcropInput directive must be placed with an input[type="file"]');
                        }

                        $scope.setImage = function(image) {
                                var reader = new FileReader();

                                reader.onload = function(ev) {
                                        $rootScope.$broadcast('JcropChangeSrc', ev.target.result);
                                        $element[0].value = '';
                                };

                                reader.readAsDataURL(image);
                        };

                        $element.on('change', function(ev) {
                                var image = ev.currentTarget.files[0];
                                $scope.setImage(image);
                        });

                }
        ])

        .controller('JcropController', ['$scope', '$element',
                function($scope, $element) {



                        /**
                         * Stores the jcrop instance
                         * @type {jCrop}
                         */
                        $scope.jcrop = jQuery.Jcrop(".ng-jcrop-image", {
                                onChange: function(c) {
                                        $scope.selection = c;
                                        $scope.$apply();
                                }
                        });
                        /**
                         * The coords of current selection
                         * @type {Array}
                         */

                        $scope.destroy = function() {
                                if ($scope.jcrop) {
                                        $scope.jcrop.destroy();
                                        $scope.jcrop = null;
                                }
                        };



                        $scope.$on('JcropChangeSrc', function(ev, src) {

                                $scope.$apply(function() {
                                        $scope.imageSrc = src;
                                });
                        });
                        $scope.$on('$destroy', $scope.destroy);

                        $scope.$watch('imageSrc', function(newValue, oldValue, scope) {
                                $scope.jcrop.setImage(newValue);
                        });
                        $scope.$watch('config', function(newValue, oldVale, scope) {
                                $scope.jcrop.setOptions(newValue);
                        })

                        $scope.$watch('thumbnail', function(newValue, oldValue, scope) {
                                if (scope.thumbnail) {} else {}
                        });

                }
        ]);


})(angular);
