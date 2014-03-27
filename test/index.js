var detect = require('../');
var assert = require('assert');

describe('language detect', function () {
  it('should error when the file doesn\'t exist', function (done) {
    detect('/where/art/thou/romeo', function (err) {
      assert.ok(err);

      return done();
    });
  });

  describe('file name detection', function () {
    it('should match the file name', function (done) {
      detect(__dirname + '/fixtures/Gemfile', function (err, language) {
        assert.equal(language.name, 'Ruby');

        return done(err);
      });
    });
  });

  describe('file extension detection', function () {
    it('should match the file extension', function (done) {
      detect(__dirname + '/fixtures/bar.h', function (err, language) {
        assert.equal(language.name, 'C++');

        return done(err);
      });
    });
  });

  describe('shebang detection', function () {
    it('should match the interpreter in the shebang', function (done) {
      detect(__dirname + '/fixtures/build', function (err, language) {
        assert.equal(language.name, 'JavaScript');

        return done(err);
      });
    });
  });

  describe('language classification', function () {
    it('should auto-detect languages as a final fallback', function (done) {
      detect(__dirname + '/fixtures/obscure', function (err, language) {
        assert.equal(language.name, 'CSS');

        return done(err);
      })
    });
  });
});
