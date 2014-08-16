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

});
