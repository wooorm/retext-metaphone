'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var nlcstToString = require('nlcst-to-string');
var visit = require('unist-util-visit');
var metaphone = require('./');

/*
 * Methods.
 */

var equal = assert.equal;

/*
 * Fixtures.
 */

var sentence = 'A simple, English, sentence';
var phonetics = ['A', 'SMPL', 'ENKLKSH', 'SNTNS'];

/**
 * Example stemmer, which expects the tree to equal `otherWord`.
 */
function stemmer() {
    return function (cst) {
        visit(cst, 'WordNode', function (node) {
            node.data = {
                'stem': nlcstToString(node)
            };
        });
    };
}

/*
 * Tests.
 */

describe('metaphone()', function () {
    it('should be of type `function`', function () {
        equal(typeof metaphone, 'function');
    });

    retext.use(metaphone).process(sentence, function (e, file) {
        var cst = file.namespace('retext').cst;

        it('should not throw', function (done) {
            done(e);
        });

        it('should process each `WordNode`', function () {
            var index = -1;

            visit(cst, 'WordNode', function (node) {
                assert('phonetics' in node.data);
                equal(node.data.phonetics, phonetics[++index]);
            });
        });
    });
});

describe('metaphone() with a stemmer', function () {
    retext.use(stemmer).use(metaphone).process(sentence, function (e, file) {
        var cst = file.namespace('retext').cst;

        it('should not throw', function (done) {
            done(e);
        });

        it('should process `stem` in each `WordNode`', function () {
            visit(cst, 'WordNode', function (node) {
                equal(node.data.stemmedPhonetics, node.data.phonetics);
            });
        });
    });
});
