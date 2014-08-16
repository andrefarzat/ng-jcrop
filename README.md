ng-jcrop
========

Angular directive to jCrop jQuery plugin
[![Build Status](https://travis-ci.org/andrefarzat/ng-jcrop.svg?branch=master)](https://travis-ci.org/andrefarzat/ng-jcrop)


### Installing

Install via `bower`

```sh
bower install ng-jcrop --save
```

It depends of jquery, so it is necessary adding both `<script>` tags to your html

```html
<script src="bower_components/jquery/dist/jquery.js"></script>
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
