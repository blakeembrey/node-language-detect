var fs       = require('fs');
var path     = require('path');
var classify = require('language-classifier');

/**
 * Map classification language names to mapped language names.
 *
 * @type {Object}
 */
var classifyMap = {
  'ruby':          'Ruby',
  'python':        'Python',
  'javascript':    'JavaScript',
  'objective-c':   'Objective-C',
  'html':          'HTML',
  'css':           'CSS',
  'shell':         'Shell',
  'c++':           'C++',
  'c':             'C',
  'coffee-script': 'CoffeeScript'
};

/**
 * Return the programming language of a given filename.
 *
 * @param {String}   filename
 * @param {Function} done
 */
exports = module.exports = function (filename, done) {
  fs.stat(filename, function (err, stats) {
    if (err) {
      return done(err);
    }

    if (!stats.isFile()) {
      return done(new Error('Should only detect files'));
    }

    // Do the simplest synchronous test based on filenames first.
    var fileDetected = exports.filename(filename);

    if (fileDetected) {
      return done(null, fileDetected);
    }

    var languages  = {};
    var shebang    = '';
    var firstChunk = true;
    var hasShebang = false;
    var shebangDetected;

    // Open a file read stream. This should be the simplest way to do
    // dynamic language detection while the stream is running.
    var stream = fs.createReadStream(filename, {
      encoding: 'utf8'
    });

    // Call `done` with the error when something breaks.
    stream.on('error', done);

    stream.on('data', function (chunk) {
      // If it's the first chunk we want to
      if (firstChunk) {
        chunk = chunk.replace(/^ +/, '');

        // If we have at least two characters left in the chunk, we can assume
        // enough of the first chunk has been received to test the shebang.
        if (chunk.length > 1) {
          firstChunk = false;

          // If we have a shebang, we need to special case the stream until
          // the first new line.
          if (chunk.substr(0, 2) === '#!') {
            hasShebang = true;
          }
        }
      }

      // While we have the shebang line, concat each chunk together for testing.
      if (hasShebang) {
        shebang += chunk;

        // On the first new line, test the shebang and attempt to close the
        // stream early.
        if (/\r?\n/.test(shebang)) {
          hasShebang      = false;
          shebangDetected = exports.shebang(shebang);

          if (shebangDetected) {
            return stream.close();
          }
        }
      }

      // If the shebang doesn't exist, fall back to language classification.
      var classified = classifyMap[classify(chunk)];

      if (classified) {
        (languages[classified]++ || (languages[classified] = 1));
      }
    });

    stream.on('end', function () {
      // We can short-circuit if the shebang was detected.
      if (shebangDetected) {
        return done(null, shebangDetected);
      }

      // No languages were detected in the entire file.
      if (!Object.keys(languages).length) {
        return done();
      }

      // Get the most popular language from language detection.
      var popular = Object.keys(languages).reduce(function (highest, language) {
        return languages[highest] > languages[language] ? highest : language;
      });

      return done(null, popular);
    });
  });
};

/**
 * Export useful direct aliases.
 *
 * @type {Object}
 */
exports.aliases      = require('./vendor/aliases.json');
exports.filenames    = require('./vendor/filenames.json');
exports.extensions   = require('./vendor/extensions.json');
exports.interpreters = require('./vendor/interpreters.json');

/**
 * Attempt to get the language based on a filename.
 *
 * @param  {String} filename
 * @return {String}
 */
exports.filename = function (filename) {
  var basename = path.basename(filename);

  // The filename was detected.
  if (exports.filenames[basename]) {
    return exports.filenames[basename];
  }

  var extension = (path.extname(basename) || '').toLowerCase();

  // The extension was recognised.
  if (exports.extensions[extension]) {
    return exports.extensions[extension];
  }
};

/**
 * Return the language from a shebang definition.
 *
 * @param  {String} file
 * @return {String}
 */
exports.shebang = function (file) {
  // Coerece to a string (in case of Buffer) and replace preceding whitespace.
  file = file.toString().replace(/^ */, '');

  // Return early if it doesn't start with a shebang.
  if (file.substr(0, 2) !== '#!') {
    return;
  }

  var bang   = file.split(/\r?\n/g)[0];
  var tokens = bang.replace(/^#! +/, '#!').split(' ');
  var pieces = tokens[0].split('/');
  var script = pieces[pieces.length - 1];

  if (script === 'env') {
    script = tokens[1];
  }

  // "python2.6" -> "python"
  script = script.replace(/(?:\d+\.?)+$/, '');

  return exports.interpreters[script] || exports.aliases[script];
};
