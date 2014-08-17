var detect = require('../');
var assert = require('assert');

describe('language detect', function () {
  it('should allow synchronous filename detection', function () {
    assert.equal(detect.filename('unknown'), null);
    assert.equal(detect.filename('test.js'), 'JavaScript');
    assert.equal(detect.filename('test.cpp'), 'C++');
  });

  it('should allow synchronous shebang detection', function () {
    assert.equal(detect.shebang(''), null);
    assert.equal(detect.shebang('#!/usr/bin/env make'), 'Makefile');
    assert.equal(detect.shebang('#!/usr/bin/sbcl --script'), 'Common Lisp');
    assert.equal(detect.shebang('#!/usr/bin/python2.6'), 'Python');
  });

  it('should allow synchronous language classification', function () {
    assert.equal(detect.classify('for link in links:'), 'Python');
  });

  it('should error when the file doesn\'t exist', function (done) {
    detect('/where/art/thou/romeo', function (err) {
      assert.ok(err);

      return done();
    });
  });

  it('should error when checking a directory', function (done) {
    detect(__dirname + '/fixtures/Cakefile', function (err) {
      assert.ok(err);

      return done();
    })
  });

  describe('file name detection', function () {
    it('should match the file name', function (done) {
      detect(__dirname + '/fixtures/Gemfile', function (err, language) {
        assert.equal(language, 'Ruby');

        return done(err);
      });
    });
  });

  describe('file extension detection', function () {
    it('should match the file extension', function (done) {
      detect(__dirname + '/fixtures/bar.h', function (err, language) {
        assert.equal(language, 'Objective-C');

        return done(err);
      });
    });
  });

  describe('shebang detection', function () {
    it('should match the interpreter in the shebang', function (done) {
      detect(__dirname + '/fixtures/build', function (err, language) {
        assert.equal(language, 'JavaScript');

        return done(err);
      });
    });

    it('should fall back when shebang is unknown', function (done) {
      detect(__dirname + '/fixtures/unknown_shebang', function (err, language) {
        assert.equal(language, 'Shell');

        return done(err);
      })
    });
  });

  describe('language classification', function () {
    it('should auto-detect languages as a final fallback', function (done) {
      detect(__dirname + '/fixtures/obscure', function (err, language) {
        assert.equal(language, 'CSS');

        return done(err);
      })
    });
  });
});
