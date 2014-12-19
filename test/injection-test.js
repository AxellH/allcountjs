var assert = require('assert');
var injection = require('../services/injection.js');
var fs = require('fs');

exports.resolveFuncArgsTest = function (test) {
    var result = injection.resolveFuncArgs(function (foo, bar) {
        return {foo: bar}
    }, function (arg) { return arg });
    assert.deepEqual(result, {foo: 'bar'});
    test.done();
};

exports.injectTest = function (test) {
    injection.providers = {};
    injection.bindFactory("foo", function (bar) {
        return bar;
    });
    injection.bindFactory("bar", function () {
        return 'bar';
    });
    assert.equal(injection.inject('foo'), 'bar');
    test.done();
};

exports.bindMultipleTest = function (test) {
    injection.providers = {};
    injection.bindFactory("foo", function (bar) {
        return {foo: bar};
    });
    injection.bindFactory("bar", function () {
        return 'bar';
    });
    injection.bindFactory('host', function (plugins) {
        return plugins;
    });
    injection.bindMultiple('plugins', ['foo', 'bar']);
    assert.deepEqual(injection.inject('host'), ['bar', {foo: 'bar'}]);
    test.done();
};

exports.inScopeTest = function (test) {
    injection.providers = {};
    injection.bindFactory("foo", function (bar) {
        return bar;
    });
    injection.bindFactory("bar", function () {
        return 'bar';
    });
    injection.inScope({
        foo: 'foo'
    }, function () {
        assert.equal(injection.inject('foo'), 'foo');
    });
    assert.equal(injection.inject('foo'), 'bar');
    test.done();
};