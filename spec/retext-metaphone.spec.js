'use strict';

var metaphone, stemmer, visit, Retext, assert,
    tree, stemmedTree, otherWords, otherPhonetics, stemmedOtherPhonetics;

metaphone = require('..');
Retext = require('retext');
visit = require('retext-visit');
stemmer = require('retext-porter-stemmer');
assert = require('assert');

tree = new Retext()
    .use(visit)
    .use(metaphone)
    .parse('A simple, english, sentence');

stemmedTree = new Retext()
    .use(visit)
    .use(metaphone)
    .use(stemmer)
    .parse(tree.toString());

otherWords = ['A', 'detestable', 'vile', 'paragraph'];
otherPhonetics = ['A', 'TTSTBL', 'FL', 'PRKRF'];
stemmedOtherPhonetics = ['A', 'TTST', 'FL', 'PRKRF'];

describe('metaphone()', function () {
    it('should be of type `function`', function () {
        assert(typeof metaphone === 'function');
    });

    it('should process each `WordNode`', function () {
        tree.visitType(tree.WORD_NODE, function (wordNode) {
            assert('phonetics' in wordNode.data);
        });
    });

    it('should set each phonetics attribute to `null` when a WordNode (no ' +
        'longer?) has a value', function () {
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                wordNode[0].fromString();
                assert(wordNode.data.phonetics === null);
            });
        }
    );

    it('should automatically reprocess `WordNode`s when their values change',
        function () {
            var iterator = -1;
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                wordNode[0].fromString(otherWords[++iterator]);
                assert(wordNode.data.phonetics === otherPhonetics[iterator]);
            });
        }
    );
});

describe('metaphone() with a stemmer', function () {
    it('should process stem in each `WordNode` if available', function () {
        stemmedTree.visitType(stemmedTree.WORD_NODE, function (wordNode) {
            assert('stemmedPhonetics' in wordNode.data);
        });
    });

    it('should set each stemmedPhonetics attribute to `null` when a ' +
        'WordNode (no longer?) has a value', function () {
            stemmedTree.visitType(stemmedTree.WORD_NODE, function (wordNode) {
                wordNode[0].fromString();
                assert(wordNode.data.stemmedPhonetics === null);
            });
        }
    );

    it('should automatically reprocess `WordNode`s stemmed phonetics when ' +
        'their values change', function () {
            var iterator = -1;
            stemmedTree.visitType(stemmedTree.WORD_NODE, function (wordNode) {
                wordNode[0].fromString(otherWords[++iterator]);
                assert(
                    wordNode.data.stemmedPhonetics ===
                    stemmedOtherPhonetics[iterator]
                );
            });
        }
    );
});
