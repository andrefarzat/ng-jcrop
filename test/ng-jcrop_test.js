describe('ng-jcrop', function(){

    beforeEach(angular.mock.module('ngJcrop'));

    describe('configuration', function(){

        it('should thrown an error if jquery isnt included', function(){
            module(function($provide){
                $provide.value('$window', {jQuery: false});
            });

            var fn = function(){
                inject(function($window){});
            };

            expect(fn).toThrow(new Error("jQuery isn't included"));
        });

        it('should thrown an error if Jcrop isnt included', function(){
            module(function($provide){
                $provide.value('$window', {jQuery: {Jcrop: false}});
            });

            var fn = function(){
                inject(function($window){});
            };

            expect(fn).toThrow(new Error("Jcrop isn't included"));
        });

    });


    describe('ng-jcrop directive', function(){

        it('should be ok', inject(function($compile){
            var div = $compile('<div ng-jcrop></div>');
        }));

    });


    describe('JcropController', function(){
        var ctrl, scope, el, getController;

        beforeEach(inject(function($controller, $rootScope, $compile){
            scope = $rootScope.$new();
            el = $compile('<div ng-jcrop></div>')(scope);

            getController = function(params){
                params = params || {};
                params.$scope = params.$scope || scope;
                params.$element = params.$element || el;
                return $controller('JcropController', params);
            };

            ctrl = getController();
        }));

        it('updateCurrentSizes', function(){
            var images = [
                {width: 13, height: 13, src:"/base/test/13x13.png"},
                {width: 11, height: 10, src:"/base/test/11x10.gif"},
                {width: 10, height: 11, src:"/base/test/10x11.gif"},
                {width: 185, height: 200, src:"/base/test/370x400.jpg"},
                {width: 236.0097323600973, height: 200, src:"/base/test/485x411.jpg"},
                {width: 3888, height: 2592, src:"/base/test/3888x2592.jpg"}
            ];

            angular.forEach(images, function(image){
                runs(function(){
                    var img = new Image();
                    img.onload = function(){
                        scope.updateCurrentSizes(img);
                        expect(scope.imgStyle.width).toBe(image.width);
                        expect(scope.imgStyle.height).toBe(image.height);
                    };

                    img.onerror = function(){
                        expect(image.src).toBe('status 200');
                    };

                    img.src = image.src;
                });
            });

            waits(500);
        });


        describe('showPreview', function(){

            beforeEach(function(){
                scope.previewImg = angular.element('<img>');
            });

            it('should do nothing if thumbnail = false', function(){
                scope.previewImg.css('width', '10000px');
                scope.showPreview();
                expect(scope.previewImg.css('width')).toBe('10000px');
            });

            it('showPreview', function(){
                scope.thumbnail = true;

                var coords = {x: 10, y: 10, w: 10, h: 10},
                    rx = 100 / coords.w,
                    ry = 100 / coords.h;

                scope.showPreview(coords);

                var expectedValues = {
                    width: Math.round(rx * scope.imgStyle.width) + 'px',
                    maxWidth: Math.round(rx * scope.imgStyle.width) + 'px',
                    height: Math.round(ry * scope.imgStyle.height) + 'px',
                    maxHeight: Math.round(ry * scope.imgStyle.height) + 'px',
                    marginLeft: '-' + Math.round(rx * coords.x) + 'px',
                    marginTop: '-' + Math.round(ry * coords.y) + 'px'
                };

                angular.forEach(expectedValues, function(value, key){
                    expect(scope.previewImg.css(key)).toBe(value);
                });

            });

        });

        describe('destroy', function(){

            it('simple execution', function(){
                scope.mainImg = angular.element('<img>');
                scope.jcrop = {'destroy': angular.identity};

                scope.destroy();
                expect(scope.jcrop).toBeNull();
            });

        });

        describe('init', function(){

            it('init with no thumbnail', function(){
                scope.init("/base/test/13x13.png");

                expect(scope.mainImg.attr('src')).toBe("/base/test/13x13.png");
                expect(scope.previewImg.attr('src')).toBeUndefined();
            });

            it('init with thumbnail', function(){
                scope.thumbnail = true;
                scope.init("/base/test/13x13.png");

                expect(scope.mainImg.attr('src')).toBe("/base/test/13x13.png");
                expect(scope.previewImg.attr('src')).toBe("/base/test/13x13.png");
            });

            it('should call init when triggering JcropChangeSrc event', inject(function($rootScope){
                spyOn(scope, 'init');
                $rootScope.$broadcast('JcropChangeSrc', "/base/test/13x13.png");
                expect(scope.init).toHaveBeenCalled();
            }));

        });

    });

    describe('ng-jcrop-input directive', function(){

        it('should be ok', inject(function($compile){
            var div = $compile('<div ng-jcrop-input></div>');
        }));

    });

    describe('JcropInputController', function(){
        var ctrl, scope, el, getController;

        beforeEach(inject(function($controller, $rootScope, $compile){
            scope = $rootScope.$new();
            el = $compile('<input type="file" ng-jcrop-input />')(scope);

            getController = function(params){
                params = params || {};
                params.$scope = params.$scope || scope;
                params.$element = params.$element || el;
                return $controller('JcropInputController', params);
            };

            ctrl = getController();
        }));

        it('should fail if it isnt an input[type="file"]', inject(function($controller, $compile){
            var err = new Error('ngJcropInput directive must be placed with an input[type="file"]');

            var fn = function(){
                el = $compile('<div ng-jcrop-input></div>')(scope);
            };

            expect(fn).toThrow(err);

            fn = function(){
                el = $compile('<input type="text" ng-jcrop-input />')(scope);
            };

            expect(fn).toThrow(err);
        }));

        it('should trigger `onFileInputChange`', function(){
            spyOn(scope, 'onFileInputChange').andCallThrough();

            el.attr('src', "/base/test/13x13.png");
            el.triggerHandler('change');

            expect(scope.onFileInputChange).toHaveBeenCalled();
        });
    });

});
