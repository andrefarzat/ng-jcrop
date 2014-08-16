(function(angular){

    angular.module('ngJcrop', [])

    .run(['$window', function($window){
        if( !$window.jQuery ){
            throw new Error("jQuery isn't included");
        }

        if( !$window.jQuery.Jcrop ){
            throw new Error("Jcrop isn't included");
        }
    }])

    .directive('ngJcrop', ['ngJcropTemplate', function(ngJcropTemplate){

        return {
            restrict: 'A',
            scope: {ngJcrop: '=', thumbnail: '='},
            template: ngJcropTemplate,
            controller: 'JcropController'
        };

    }])

    .directive('ngJcropInput', function(){

        return {
            restrict: 'A',
            controller: 'JcropInputController'
        };

    })

    .value('ngJcropTemplate',
        '<div class="ng-jcrop">' +
        '    <div class="ng-jcrop-image-wrapper">' +
        '        <img class="ng-jcrop-image" />' +
        '   </div>' +
        '   <div class="ng-jcrop-thumbnail-wrapper" ng-style="previewImgStyle">' +
        '       <img class="ng-jcrop-thumbnail" />' +
        '   </div>' +
        '</div>'
    )

    .controller('JcropInputController', ['$rootScope', '$element', '$scope',
    function($rootScope, $element, $scope){

        if( $element[0].type !== 'file' ){
            throw new Error('ngJcropInput directive must be placed with an input[type="file"]');
        }

        $scope.onFileInputChange = function(ev){
            var image = ev.currentTarget.files[0],
                reader = new FileReader();

            reader.onload = function(ev){
                $rootScope.$broadcast('JcropChangeSrc', ev.target.result);
            };

            reader.readAsDataURL(image);
        };

        $element.on('change', function(ev){ $scope.onFileInputChange(ev); });

    }])

    .controller('JcropController', ['$scope', '$element', function($scope, $element){

        var MAX_WIDTH = 300,
            MAX_HEIGHT = 200;

        /**
         * jquery element storing the main img tag
         * @type {jQuery}
         */
        $scope.mainImg = null;
        $scope.imgStyle = {'width': MAX_WIDTH, 'height': MAX_HEIGHT};

        /**
         * jquery element storing the preview img tag
         * @type {jQuery}
         */
        $scope.previewImg = null;
        $scope.previewImgStyle = {'width': '100px', 'height': '100px', 'overflow': 'hidden', 'margin-left': '5px'};

        /**
         * Stores the jcrop instance
         * @type {jCrop}
         */
        $scope.jcrop = null;

        /**
         * Updates the `imgStyle` with width and height
         * @param  {Image} img
         */
        $scope.updateCurrentSizes = function(img){
            var widthShrinkRatio = img.width/MAX_WIDTH,
                heightShrinkRatio = img.height/MAX_HEIGHT,
                widthConstraining = img.width > MAX_WIDTH && widthShrinkRatio > heightShrinkRatio,
                heightConstraining = img.height > MAX_HEIGHT && heightShrinkRatio > widthShrinkRatio;

            if (widthConstraining) {
                $scope.imgStyle.width = MAX_WIDTH;
                $scope.imgStyle.height = img.height/widthShrinkRatio;
            } else if (heightConstraining) {
                $scope.imgStyle.height = MAX_HEIGHT;
                $scope.imgStyle.width = img.width/heightShrinkRatio;
            } else {
                $scope.imgStyle.height = img.height;
                $scope.imgStyle.width = img.width;
            }
        };

        /**
         * Updates the preview regarding the coords form jCrop
         */
        $scope.showPreview = function(coords){
            if( !$scope.thumbnail ){
                return;
            }

            var rx = 100 / coords.w;
            var ry = 100 / coords.h;

            $scope.previewImg.css({
                width: Math.round(rx * $scope.imgStyle.width) + 'px',
                maxWidth: Math.round(rx * $scope.imgStyle.width) + 'px',
                height: Math.round(ry * $scope.imgStyle.height) + 'px',
                maxHeight: Math.round(ry * $scope.imgStyle.height) + 'px',
                marginLeft: '-' + Math.round(rx * coords.x) + 'px',
                marginTop: '-' + Math.round(ry * coords.y) + 'px'
            });
        };

        /**
         * @event
         */
        $scope.onMainImageLoad = function(ev){
            $scope.mainImg.off('load', $scope.onMainImageLoad);
            $scope.updateCurrentSizes($scope.mainImg[0]);

            var config = {
                onChange: $scope.showPreview,
                onSelect: $scope.showPreview,
                aspectRatio: 1
            };

            $scope.jcrop = jQuery.Jcrop($scope.mainImg, config);
        };

        /**
         * Destroys the current jcrop instance
         */
        $scope.destroy = function(){
            if( $scope.jcrop ){
                $scope.mainImg.off('load');
                $scope.jcrop.destroy();
                $scope.jcrop = null;
            }
        };

        /**
         * @init
         */
        $scope.init = function(src){
            $scope.destroy();

            $scope.mainImg = $('<img>').addClass('ng-jcrop-image');
            $scope.mainImg.on('load', $scope.onMainImageLoad);
            $scope.mainImg.css({ maxWidth: MAX_WIDTH, maxHeight: MAX_HEIGHT });
            $scope.mainImg.attr('src', src);

            $element.find('.ng-jcrop-image-wrapper').empty().append($scope.mainImg);

            var thumbnailWrapper = $element.find('.ng-jcrop-thumbnail-wrapper');
            $scope.previewImg = $element.find('.ng-jcrop-thumbnail');

            if( $scope.thumbnail ){
                thumbnailWrapper.show();
                $scope.previewImg.attr('src', src);
            } else {
                thumbnailWrapper.hide();
            }

        };

        $scope.$on('$destroy', $scope.destroy);

        $scope.$on('JcropChangeSrc', function(ev, src){
            $scope.init(src);
        });

        $scope.$watch('ngJcrop', function(newValue, oldValue, scope){
            scope.init(newValue);
        });

        $scope.$watch('thumbnail', function(newValue, oldValue, scope){
            var src = scope.mainImg.attr('src');
            scope.init(src);
        });

    }]);


})(angular);
