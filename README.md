# Language Detect

Check the language of any file by comparing filenames, extensions, shebangs and finally falling back to a programming language classifier.

## Installation

```
npm install language-detect --save
```

## Usage

```javascript
var detect = require('language-detect');

detect(__dirname + '/test.js', function (err, language) {
  console.log(language.name); //=> "JavaScript"
  console.log(language.type); //=> "programming"
});
```

## License

MIT
