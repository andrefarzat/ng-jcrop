describe('ng-jcrop', function(){

    var ngJcropConfigProvider;

    beforeEach(function(){
        angular.module('testApp', []).config(function (_ngJcropConfigProvider_){
            ngJcropConfigProvider = _ngJcropConfigProvider_;
        });

        angular.mock.module('ngJcrop', 'testApp');
    });

    describe('configuration', function(){

        it('should return the new jcrop config', inject(function(ngJcroptDefaultConfig){
            var config = angular.extend({}, ngJcroptDefaultConfig, {jcrop: {maxWidth: 1000, maxHeight: 2000, aspectRatio: 3}});
            ngJcropConfigProvider.setJcropConfig({maxWidth: 1000, maxHeight: 2000, aspectRatio: 3});
            expect(ngJcropConfigProvider.$get()['default'].jcrop).toEqual(config.jcrop);
        }));

        it('should return the new config', inject(function(ngJcroptDefaultConfig){
            var config = angular.extend({}, ngJcroptDefaultConfig, {maxWidtwidthLimith: 2, widthHeight: 10, template: 'oi'});
            ngJcropConfigProvider.setConfig({maxWidtwidthLimith: 2, widthHeight: 10, template: 'oi'});
            expect(ngJcropConfigProvider.$get()['default']).toEqual(config);
        }));

        it('should return the default previewImgStyle config', inject(function(ngJcropConfig){
            // yep, hard coded here. I want it to fail once it changes
            expect(ngJcropConfig['default'].previewImgStyle).toEqual({'width': '100px', 'height': '100px', 'overflow': 'hidden', 'margin-left': '5px'});
        }));

        it('should return the new previewImgStyle config', inject(function(ngJcropConfig){
            ngJcropConfig = ngJcropConfig['default'];
            var previewImgStyle = angular.extend({}, ngJcropConfig.previewImgStyle, {'width': '200px', 'overflow': 'scroll', 'box-sizing': 'border-box'})
                config = angular.extend({}, ngJcropConfig, {'previewImgStyle': previewImgStyle});

            ngJcropConfigProvider.setPreviewStyle({'width': '200px', 'overflow': 'scroll', 'box-sizing': 'border-box'});
            expect(ngJcropConfigProvider.$get()['default']).toEqual(config);
        }));

        it('should have two different configurations', inject(function($injector){
            ngJcropConfigProvider.setConfig('diffName', {});
            var ngJcropConfig = $injector.get('ngJcropConfig');

            expect(ngJcropConfig['default']).not.toBeUndefined();
            expect(ngJcropConfig['diffName']).not.toBeUndefined();
        }));

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
        var scope;

        beforeEach(inject(function($rootScope){
            scope = $rootScope.$new();
        }));

        it('should be ok', inject(function($compile){
            var div = $compile('<div ng-jcrop selection="[1,2,3,4]"></div>')(scope);
        }));

        it('should fail', inject(function($compile){
            var fn = function(){
                var div = $compile('<div ng-jcrop></div>')(scope);
            };
            expect(fn).toThrow(new Error('ngJcrop: attribute `selection` is mandatory'));

            fn = function(){
                var div = $compile('<div ng-jcrop selection="123"></div>')(scope);
            };
            expect(fn).toThrow(new Error('ngJcrop: attribute `selection` must be an array'));

            fn = function(){
                var div = $compile('<div ng-jcrop selection="[]" coords="123"></div>')(scope);
            };
            expect(fn).toThrow(new Error('ngJcrop: if given, attribute `coords` must be an array'));
        }));
    });


    describe('JcropController', function(){
        var ctrl, scope, el, getController, compile;

        beforeEach(inject(function($controller, $rootScope, $compile){
            scope = $rootScope.$new();
            scope.src = "/base/test/13x13.png";
            scope.thumbnail = true;
            scope.selection = [];
            el = $compile('<div ng-jcrop="src" thumbnail="thumbnail" selection="selection"></div>')(scope);

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
                {width: 13, height: 13, src: "/base/test/13x13.png"},
                {width: 11, height: 10, src: "/base/test/11x10.gif"},
                {width: 10, height: 11, src: "/base/test/10x11.gif"},
                {width: 277.5, height: 300, src: "/base/test/370x400.jpg"},
                {width: 245.9016393442623, height: 300, src: "/base/test/350x427.jpg"},
                {width: 300, height: 254.22680412371133, src: "/base/test/485x411.jpg"},
                {width: 300, height: 60, src: "/base/test/1000x200.png"},
                {width: 300, height: 200, src: "/base/test/3888x2592.jpg"}
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

        it('should reset the config when JcropChangeSrc is triggered', function(){
            spyOn(scope, 'setSelection');
            scope.$emit('JcropChangeSrc', 'new-src.png', 'default');

            expect(scope.setSelection).toHaveBeenCalled();
            expect(scope.ngJcrop).toBe('new-src.png');
        });

        it('should transform `selection` into an array in case it\'s not', function(){
            scope.initMainImage();

            scope.coords = null;
            scope.selection = null;
            scope.setSelection({x: 0, y: 0, x2: 0, y2: 0, w: 0, h: 0});
            expect(scope.selection).toEqual([0, 0, 0, 0, 0, 0]);
        });

        describe('showPreview', function(){

            beforeEach(function(){
                scope.selection = [];
                scope.previewImg = angular.element('<img width="100px" />');
            });

            it('should do nothing if thumbnail = false', function(){
                scope.initMainImage();
                scope.thumbnail = false;
                scope.showPreview({});
                expect(scope.previewImg.css('width')).toBe('0px');
            });

            it('showPreview', function(){
                scope.initMainImage();
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

            it('should show the right size of the preview when trueSize is passed', function() {
                ngJcropConfigProvider.setJcropConfig({
                    trueSize: [600, 600]
                });

                scope.previewImg = angular.element('<img width="300" height="300" />');

                scope.initMainImage();
                scope.thumbnail = true;

                var coords = {x: 10, y: 10, w: 10, h: 10},
                    rx = 100 / coords.w,
                    ry = 100 / coords.h;

                scope.showPreview(coords);

                var expectedValues = {
                    width: Math.round(rx * 600) + 'px',
                    maxWidth: Math.round(rx * 600) + 'px',
                    height: Math.round(ry * 600) + 'px',
                    maxHeight: Math.round(ry * 600) + 'px',
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

            it('with no thumbnail', inject(function($compile){
                scope.thumbnail = false;
                scope.ngJcrop = "/base/test/13x13.png";
                scope.$apply();

                expect(scope.mainImg.attr('src')).toBe("/base/test/13x13.png");
                expect(scope.previewImg.css('display')).toBe('none');
            }));

            it('with thumbnail', function(){
                scope.thumbnail = true;
                scope.init("/base/test/13x13.png");

                expect(scope.mainImg.attr('src')).toBe("/base/test/13x13.png");
                expect(scope.previewImg.attr('src')).toBe("/base/test/13x13.png");
            });

            it('with no selection', inject(function($compile){
                expect(function() {
                    scope.selection = null;
                    el = $compile('<div ng-jcrop="src" thumbnail="thumbnail" selection="selection"></div>')(scope);
                    ctrl = getController();
                }).toThrow('ngJcrop: attribute `selection` is mandatory');
            }));

            it('throwing an exception if gives an unknown config name', inject(function($compile){
                expect(function(){
                    el = $compile('<div ng-jcrop="src" thumbnail="thumbnail" selection="selection" ng-jcrop-config-name="unknown"></div>')(scope);
                }).toThrow('Unknown "unknown" config name');
            }));

            it('with the default config', inject(function($compile){
                expect(scope.ngJcropConfigName).toBe('default');
            }));

            it('with a diff config', inject(function($compile){
                ngJcropConfigProvider.setJcropConfig('diffConfig', {});
                el = $compile('<div ng-jcrop="src" thumbnail="thumbnail" selection="selection" ng-jcrop-config-name="diffConfig"></div>')(scope);
            }));

        });


        describe('getShrinkRatio', function(){

            it('should return the correct Shrink Ratio', function(){
                var images = [
                    {ratio: 1.2125, maxWidth: 400, maxHeight: 400, src: '/base/test/485x411.jpg'},
                    {ratio: 1.0275, maxWidth: 600, maxHeight: 400, src: '/base/test/485x411.jpg'},
                    {ratio: 1.2125, maxWidth: 400, maxHeight: 500, src: '/base/test/485x411.jpg'},
                    {ratio: 10, maxWidth: 30, maxHeight: 40, src: '/base/test/300x400.jpg'},
                    {ratio: 1, maxWidth: 900, maxHeight: 190, src: '/base/test/1000x200.jpg'}
                ];

                angular.forEach(images, function(image){
                    runs(function(){
                        ngJcropConfigProvider.setJcropConfig({
                            maxWidth: image.maxWidth,
                            maxHeight: image.maxHeight
                        });

                        scope.initMainImage(image.src);

                        scope.mainImg.on('load', function(){
                            expect(scope.getShrinkRatio()).toBe(image.ratio);
                        });
                    });

                    waits(200);
                });

            });

        });

    });

    describe('ng-jcrop-input directive', function(){

        it('should be ok', inject(function($compile){
            var div = $compile('<div ng-jcrop-input></div>');
        }));

    });

    describe('JcropInputController', function(){
        var ctrl, scope, el, getController, FileReader;

        beforeEach(inject(function($controller, $rootScope, $compile){
            scope = $rootScope.$new();
            el = $compile('<input type="file" ng-jcrop-input />')(scope);
            FileReader = function() {
                this.readAsDataURL = function(){
                    var ev = {target: {result: "THE_RESULT"}};
                    this.onload(ev);
                };
            };

            getController = function(params){
                params = params || {};
                params.$scope = params.$scope || scope;
                params.$element = params.$element || el;
                params.FileReader = params.FileReader || FileReader;
                return $controller('JcropInputController', params);
            };

            ctrl = getController();
        }));

        it('should fail if it isnt an input[type="file"] or input[type="url"]', inject(function($controller, $compile){
            var err = new Error('ngJcropInput directive must be placed with an input[type="file"] or input[type="url"]');

            var fn = function(){
                el = $compile('<div ng-jcrop-input></div>')(scope);
            };
            expect(fn).toThrow(err);

            fn = function(){
                el = $compile('<input type="text" ng-jcrop-input />')(scope);
            };
            expect(fn).toThrow(err);
        }));

        it('should set a new image in a input[type="file"]', inject(function($rootScope){
            spyOn(scope, 'setImage').andCallThrough();
            spyOn(scope, 'onFileReaderLoad').andCallThrough();
            var ev = {currentTarget: {files: ["ARG_1"]}};

            scope.onChange(ev);
            expect(scope.setImage).toHaveBeenCalledWith("ARG_1");
            expect(scope.onFileReaderLoad).toHaveBeenCalledWith({target: {result: "THE_RESULT"}});
        }));

        it('should set a new image in a input[type="url"]', inject(function($rootScope, $compile){
            var scope = $rootScope.$new();
            var el = $compile('<input type="url" ng-jcrop-input />')(scope);
            el[0].value = '/base/test/13x13.png';

            ctrl = getController({$scope: scope, $element: el});
            spyOn(scope, 'setUrl');

            el.trigger('change');
            expect(scope.setUrl).toHaveBeenCalledWith('/base/test/13x13.png');
        }));
    });

});
