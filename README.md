ng-jcrop
========

Alternative of Angular directive to jCrop jQuery plugin from https://github.com/andrefarzat/ng-jcrop/blob/master/ng-jcrop.js


### Installing

Clone this Repo

It depends of angular, jquery and jquery-jcrop, so it is necessary including all libraries

```html
<link rel="stylesheet" href="bower_components/jcrop/css/jquery.Jcrop.css" />

<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/jcrop/js/jquery.Jcrop.js"></script>
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/ng-jcrop/ng-jcrop.js"></script>
```

### Usage

```js
// add 'ngJcrop' as dependency to your module
var yourModule = angular.module("yourModule", ['ngJcrop']);
```

And add the `ng-jcrop` directive in an `<div>` giving the
image's src as the value
```html
<script>

var app = angular.module('yourModule', ['ngJcrop']);


app.controller('SomeController', function($scope){
    $scope.obj = {}

    // The url or the data64 for the image
    $scope.obj.src = 'beautifulImage.jpg';

    // Must be [x, y, x2, y2, w, h]

    // You can add a thumbnail if you want
    $scope.obj.thumbnail = true;
    $scope.obj.coords = {
        'h': 100,
        'w': 100,
        'x': 100,
        'y': 100,
        'x2': 100,
        'y2': 100
    }
    $scope.obj.config = {
        bgColor: 'black',
        bgOpacity: .4,
        aspectRatio: 16 / 9,
        boxWidth: 300,
        boxHeight: 400
    };
});
</script>


<div ng-jcrop image-src="obj.src" selection="obj.coords" thumbnail="obj.thumbnail" config="obj.config"></div>
````

Note that thumbnail is unavialable now
