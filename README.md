# Language Detect

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

Detect the programming language of any file by checking the file name, file extension, file shebang and finally falling back to a programming language classifier. For more language information, use in conjuction with [language-map](https://github.com/blakeembrey/language-map).

## Installation

```
npm install language-detect --save
```

## Usage

```javascript
var detect = require('language-detect');

detect(__dirname + '/test.js', function (err, language) {
  console.log(err);      //=> null
  console.log(language); //=> "JavaScript"
});
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/language-detect.svg?style=flat
[npm-url]: https://npmjs.org/package/language-detect
[travis-image]: https://img.shields.io/travis/blakeembrey/node-language-detect.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/node-language-detect
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/node-language-detect.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/node-language-detect?branch=master
[gittip-image]: https://img.shields.io/gittip/blakeembrey.svg?style=flat
[gittip-url]: https://www.gittip.com/blakeembrey
