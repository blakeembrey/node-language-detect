# Language Detect

Detect the programming language of any file by checking the file name, file extension, file shebang and finally falling back to a programming language classifier.

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
