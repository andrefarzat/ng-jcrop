[![Build Status](https://travis-ci.org/andrefarzat/ng-jcrop.svg?branch=master)](https://travis-ci.org/andrefarzat/ng-jcrop)
[![Coverage Status](https://coveralls.io/repos/andrefarzat/ng-jcrop/badge.png)](https://coveralls.io/r/andrefarzat/ng-jcrop)
[![Code Climate](https://codeclimate.com/github/andrefarzat/ng-jcrop/badges/gpa.svg)](https://codeclimate.com/github/andrefarzat/ng-jcrop)

ng-jcrop
========

Angular directive to jCrop jQuery plugin


### Installing

Install via `bower`

```sh
bower install ng-jcrop --save
```


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
angular.controller('SomeController', function($scope){
    $scope.obj = {}

    // The url or the data64 for the image
    $scope.obj.src = 'beautifulImage.jpg';

    // Must be [x, y, x2, y2, w, h]
    $scope.obj.coords = [100, 100, 200, 200, 100, 100];

    // You can add a thumbnail if you want
    $scope.obj.thumbnail = true;

     $scope.onChangeCropArea = function(cords){
        // in cords var you have access to all cords and that wil be trigered all time when user interact with crop area
     }
});
</script>
```
```html
<div ng-jcrop="obj.src" selection="obj.coords" thumbnail="obj.thumbnail"></div>
```

You also can use with by setting aspect ratio (by default its 1)
```html

<div ng-jcrop="obj.src" selection="obj.coords" aspect-ratio="3/4" thumbnail="obj.thumbnail"></div>
```
If you want  attach your callback from controller you should write in attribute like this

<div ng-jcrop="obj.src" selection="obj.coords" aspect-ratio="3/4"  thumbnail="obj.thumbnail" on-change-fn="onChangeCropArea(cords)"></div>

````

Testing

It is necessary install karma and its dependencies

```shell
npm install
```

Then you can run the tests

```shell
npm test
```
