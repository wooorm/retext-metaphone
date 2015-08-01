(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextMetaphone = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:metaphone
 * @fileoverview Retext implementation of the Metaphone algorithm.
 */

'use strict';

/*
 * Dependencies.
 */

var algorithm = require('metaphone');
var visit = require('unist-util-visit');
var nlcstToString = require('nlcst-to-string');

/**
 * Patch a `phonetics` property on `node` (a word-node).
 * When a `stem` property is available on the node’s data
 * object, a `stemmedPhonetics` is added on the data
 * as well.
 *
 * @param {NLCSTWordNode} node - Node.
 */
function patch(node) {
    var data = node.data || {};
    var value = nlcstToString(node);

    data.phonetics = algorithm(value);

    if ('stem' in data) {
        data.stemmedPhonetics = algorithm(data.stem);
    }

    node.data = data;
}

/**
 * Patch `stem` on each node.
 *
 * @param {NLCSTNode} cst - Syntax tree.
 */
function transformer(cst) {
    visit(cst, 'WordNode', patch);
}

/**
 * Define `metaphone`.
 *
 * @return {Function} - `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose `metaphone`.
 */

module.exports = attacher;

},{"metaphone":2,"nlcst-to-string":3,"unist-util-visit":4}],2:[function(require,module,exports){
'use strict';

var EXPRESSION_DUPLICATE_ADJACENT_LETTERS,
    EXPRESSION_INITIALS,
    EXPRESSION_MB_FINAL,
    EXPRESSION_C,
    EXPRESSION_TO_X,
    EXPRESSION_TO_S,
    EXPRESSION_D_TO_J,
    EXPRESSION_D,
    EXPRESSION_G_NOT_FINAL,
    EXPRESSION_GN_OR_GNED_FINAL,
    EXPRESSION_G_TO_J,
    EXPRESSION_G,
    EXPRESSION_H,
    EXPRESSION_CK,
    EXPRESSION_PH,
    EXPRESSION_Q,
    EXPRESSION_S,
    EXPRESSION_T,
    EXPRESSION_TH,
    EXPRESSION_TCH,
    EXPRESSION_V,
    EXPRESSION_WH,
    EXPRESSION_W,
    EXPRESSION_INITIAL_X,
    EXPRESSION_X,
    EXPRESSION_Y,
    EXPRESSION_Z,
    EXPRESSION_VOWELS;

/*
 * Matches duplicate characters (excluding `c`), of which
 * one should be dropped.
 */

EXPRESSION_DUPLICATE_ADJACENT_LETTERS = /([^c])\1/g;

/*
 * Matches two characters at the start of a string, of
 * which the first is silent.
 */

EXPRESSION_INITIALS = /^(kn|gn|pn|ae|wr)/g;

/*
 * Matches `mb` at the end of string, of which the `b`
 * should be dropped.
 */

EXPRESSION_MB_FINAL = /(m)b$/g;

/*
 * Matches `c`.
 */

EXPRESSION_C = /c/g;

/*
 * Matches values which should be transformed to `x`.
 */

EXPRESSION_TO_X = /^ch|[^s]ch|cia/g;

/*
 * Matches values which should be transformed to `s`.
 */

EXPRESSION_TO_S = /c([iey])/g;

/*
 * Matches values containing `d` which should be
 * transformed to `j`.
 */

EXPRESSION_D_TO_J = /d(g[eiy])/g;

/*
 * Matches `d`.
 */

EXPRESSION_D = /d/g;

/*
 * Matches values containing `gh` of which the `g` should
 * be dropped.
 */

EXPRESSION_G_NOT_FINAL = /g(h[^aeiou])/g;

/*
 * Matches final values of which the `g` should be dropped.
 *
 * Bug: All D's were transformed to T's, weird.
 */

EXPRESSION_GN_OR_GNED_FINAL = /g(n(ed)?)$/g;

/*
 * Matches values of which the `g` should be dropped.
 *
 * Bug: Now, the spec says not to transform G to J when
 * double G's occur. As GG is already removed by
 * duplicate adjacent letters, it's ignored here.
 */

EXPRESSION_G_TO_J = /g([iey])/g;

/*
 * Matches `g`.
 */

EXPRESSION_G = /g/g;

/*
 * Matches values of which the `h` should be dropped.
 */

EXPRESSION_H = /([aeiou])h([^aeiou]|$)/g;

/*
 * Matches `ck`.
 */

EXPRESSION_CK = /ck/g;

/*
 * Matches `ph`.
 */

EXPRESSION_PH = /ph/g;

/*
 * Matches `q`.
 */

EXPRESSION_Q = /q/g;

/*
 * Matches values containing `s` which should be replaced
 * with `x`.
 */

EXPRESSION_S = /s(h|ia|io)/g;

/*
 * Matches values containing `t` which should be replaced
 * with `x`.
 */

EXPRESSION_T = /t(ia|io)/g;

/*
 * Matches `th`.
 */

EXPRESSION_TH = /th/g;

/*
 * Matches `tch`.
 */

EXPRESSION_TCH = /tch/g;

/*
 * Matches `v`.
 */

EXPRESSION_V = /v/g;

/*
 * Matches initial `wh`.
 */

EXPRESSION_WH = /^wh/g;

/*
 * Matches `w`, not followed by a vowel.
 */

EXPRESSION_W = /w([^aeiou]|$)/g;

/*
 * Matches initial `x`.
 */

EXPRESSION_INITIAL_X = /^x/g;

/*
 * Matches `x`.
 */

EXPRESSION_X = /x/g;

/*
 * Matches `y`, not followed by a vowel.
 */

EXPRESSION_Y = /y([^aeiou]|$)/g;

/*
 * Matches `z`.
 */

EXPRESSION_Z = /z/;

/*
 * Matches vowels (no `y`).
 */

EXPRESSION_VOWELS = /[aeiou]/g;

/**
 * Return the character at `1`.
 *
 * @param {string} $0
 * @return {string}
 */
function initials($0) {
    return $0.charAt(1);
}

/**
 * Return the value, `c`s replaced with `x`s.
 *
 * @param {string} $0
 * @return {string}
 */
function cToX($0) {
    return $0.replace(EXPRESSION_C, 'x');
}

/**
 * Get the phonetics according to the original Metaphone
 * algorithm from a value.
 *
 * @param {string} value - value to detect phonetics for.
 * @return {string} phonetics.
 */
function metaphone(value) {
    value = String(value)
        .toLowerCase()
        .replace(EXPRESSION_DUPLICATE_ADJACENT_LETTERS, '$1')
        .replace(EXPRESSION_INITIALS, initials)
        .replace(EXPRESSION_MB_FINAL, '$1')
        .replace(EXPRESSION_CK, 'k')
        .replace(EXPRESSION_TO_X, cToX)
        .replace(EXPRESSION_TO_S, 's$1')
        .replace(EXPRESSION_C, 'k')
        .replace(EXPRESSION_D_TO_J, 'j$1')
        .replace(EXPRESSION_D, 't')
        .replace(EXPRESSION_G_NOT_FINAL, '$1')
        .replace(EXPRESSION_GN_OR_GNED_FINAL, '$1')
        .replace(EXPRESSION_G_TO_J, 'j$1')
        .replace(EXPRESSION_G, 'k')
        .replace(EXPRESSION_H, '$1$2')
        .replace(EXPRESSION_PH, 'f')
        .replace(EXPRESSION_Q, 'k')
        .replace(EXPRESSION_S, 'x$1')
        .replace(EXPRESSION_INITIAL_X, 's')
        .replace(EXPRESSION_X, 'ks')
        .replace(EXPRESSION_T, 'x$1')
        .replace(EXPRESSION_TH, '0')
        .replace(EXPRESSION_TCH, 'ch')
        .replace(EXPRESSION_V, 'f')
        .replace(EXPRESSION_WH, 'w')
        .replace(EXPRESSION_W, '$1')
        .replace(EXPRESSION_Y, '$1')
        .replace(EXPRESSION_Z, 's');

    value = value.charAt(0) + value.slice(1).replace(EXPRESSION_VOWELS, '');

    return value.toUpperCase();
}

/*
 * Expose `metaphone`.
 */

module.exports = metaphone;

},{}],3:[function(require,module,exports){
'use strict';

/**
 * Stringify an NLCST node.
 *
 * @param {NLCSTNode} nlcst
 * @return {string}
 */
function nlcstToString(nlcst) {
    var values,
        length,
        children;

    if (typeof nlcst.value === 'string') {
        return nlcst.value;
    }

    children = nlcst.children;
    length = children.length;

    /**
     * Shortcut: This is pretty common, and a small performance win.
     */

    if (length === 1 && 'value' in children[0]) {
        return children[0].value;
    }

    values = [];

    while (length--) {
        values[length] = nlcstToString(children[length]);
    }

    return values.join('');
}

/*
 * Expose `nlcstToString`.
 */

module.exports = nlcstToString;

},{}],4:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module unist:util:visit
 * @fileoverview Utility to recursively walk over unist nodes.
 */

'use strict';

/**
 * Walk forwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   forwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function forwards(values, callback) {
    var index = -1;
    var length = values.length;

    while (++index < length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Walk backwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   backwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function backwards(values, callback) {
    var index = values.length;
    var length = -1;

    while (--index > length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Visit.
 *
 * @param {Node} tree - Root node
 * @param {string} [type] - Node type.
 * @param {function(node): boolean?} callback - Invoked
 *   with each found node.  Can return `false` to stop.
 * @param {boolean} [reverse] - By default, `visit` will
 *   walk forwards, when `reverse` is `true`, `visit`
 *   walks backwards.
 */
function visit(tree, type, callback, reverse) {
    var iterate;
    var one;
    var all;

    if (typeof type === 'function') {
        reverse = callback;
        callback = type;
        type = null;
    }

    iterate = reverse ? backwards : forwards;

    /**
     * Visit `children` in `parent`.
     */
    all = function (children, parent) {
        return iterate(children, function (child, index) {
            return child && one(child, index, parent);
        });
    };

    /**
     * Visit a single node.
     */
    one = function (node, index, parent) {
        var result;

        index = index || (parent ? 0 : null);

        if (!type || node.type === type) {
            result = callback(node, index, parent || null);
        }

        if (node.children && result !== false) {
            return all(node.children, node);
        }

        return result;
    };

    one(tree);
}

/*
 * Expose.
 */

module.exports = visit;

},{}]},{},[1])(1)
});