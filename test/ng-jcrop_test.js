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
        var ctrl, scope, el;

        beforeEach(inject(function($controller, $rootScope, $compile){
            scope = $rootScope.$new();
            el = $compile('<div ng-jcrop></div>');
            ctrl = $controller('JcropController', {
                $scope: scope,
                $element: el
            });
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

    });

});
