var fs       = require('fs');
var path     = require('path');
var classify = require('language-classifier');

var map          = require('./vendor/map.json');
var aliases      = require('./vendor/aliases.json');
var filenames    = require('./vendor/filenames.json');
var extensions   = require('./vendor/extensions.json');
var interpreters = require('./vendor/interpreters.json');

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
 * Extract the language from the file extension.
 *
 * @param  {String} file
 * @return {String}
 */
var fromExtension = function (file) {
  var extension = path.extname(file);

  return extension && extensions[extension.toLowerCase()];
};

/**
 * Extract the language from the file name.
 *
 * @param  {String} file
 * @return {String}
 */
var fromFilename = function (file) {
  return filenames[path.basename(file)];
};

/**
 * Extract the language from the shebang.
 *
 * @param  {String} bang
 * @return {String}
 */
var fromShebang = function (bang) {
  var tokens = bang.replace(/^#! +/, '#!').split(' ');
  var pieces = tokens[0].split('/');
  var script = pieces[pieces.length - 1];

  if (script === 'env') {
    script = tokens[1];
  }

  // "python2.6" -> "python"
  script = script.replace(/(?:\d+\.?)+$/, '');

  return interpreters[script] || aliases[script];
};

/**
 * Return the programming language of a given file.
 *
 * @param {String}   file
 * @param {Function} done
 */
module.exports = function (file, done) {
  fs.stat(file, function (err, stats) {
    if (err) {
      return done(err);
    }

    var filename;
    var extension;
    var languages  = {};
    var firstChunk = true;

    // Detect the language from the filename.
    if (filename = fromFilename(file)) {
      return done(null, map[filename]);
    }

    if (extension = fromExtension(file)) {
      return done(null, map[extension]);
    }

    var stream = fs.createReadStream(file, {
      encoding: 'utf8'
    });

    // Call `done` with the error when something breaks.
    stream.on('error', done);

    stream.on('data', function (chunk) {
      if (firstChunk) {
        firstChunk = false;

        // If it's the first chunk and looks like a shebang, attempt to
        // short curcuit file language detection.
        if (/^#!/.test(chunk)) {
          var shebang = fromShebang(chunk.split(/\r?\n/g)[0]);

          if (shebang) {
            languages[shebang] = 1;
            return stream.close();
          }
        }
      }

      var classified = classifyMap[classify(chunk)];

      // If it was manually classified, put the classification into the
      // languages object and increment the counter.
      if (classified) {
        ++languages[classified] || (languages[classified] = 1);
      }
    });

    stream.on('end', function () {
      // No languages detected.
      if (!Object.keys(languages).length) {
        return done();
      }

      // Get the most popular language from language detection.
      var popular = Object.keys(languages).reduce(function (highest, language) {
        return languages[highest] > languages[language] ? highest : language;
      });

      return done(null, map[popular]);
    });
  });
};
