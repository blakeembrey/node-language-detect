# Language Detect

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
