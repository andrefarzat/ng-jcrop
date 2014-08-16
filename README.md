[![Build Status](https://travis-ci.org/andrefarzat/ng-jcrop.svg?branch=master)](https://travis-ci.org/andrefarzat/ng-jcrop)
[![Coverage Status](https://coveralls.io/repos/andrefarzat/ng-jcrop/badge.png)](https://coveralls.io/r/andrefarzat/ng-jcrop)

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
<div ng-jcrop="beautifulImage.jpg"></div>
````

You can add a thumbnail if you want
```html
<div ng-jcrop="beautifulImage.jpg" thumbnail="true"></div>
````


### Testing

It is necessary install karma and its dependencies
```sh
npm install
```

Then you can run the tests
```sh
npm test
```
