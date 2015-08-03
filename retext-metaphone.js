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
/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module metaphone
 * @fileoverview Fast Metaphone implementation.
 */

'use strict';

/*
 * Constants.
 */

var SH = 'X';
var TH = '0';

/**
 * Turn `character` into a single, upper-case character.
 *
 * @param {string} character - Value.
 * @return {string} - `character`’s first character,
 *   upper-cased.
 */
function char(character) {
    return String(character).charAt(0).toUpperCase();
}

/**
 * Get the upper-case character code of the first character
 * in `character`.
 *
 * @param {string} character - Value.
 * @return {number} - `character`’s first character,
 *   upper-cased, code.
 */
function charCode(character) {
    return char(character).charCodeAt(0);
}

/**
 * Check whether `character` is in the alphabet.
 *
 * @param {string} character - Value.
 * @return {boolean} - Whether `character` is in the
 *   alphabet.
 */
function alpha(character) {
    var code = charCode(character);

    return code >= 65 /* A */ && code <= 90 /* Z */;
}

/**
 * Check whether `character` forms a dipthong when
 * preceding H.
 *
 * @param {string} character - Value.
 * @return {boolean} - Whether `character` forms a
 *   dipthong.
 */
function dipthongH(character) {
    character = char(character);

    return character === 'C' ||
        character === 'G' ||
        character === 'P' ||
        character === 'S' ||
        character === 'T';
}

/**
 * Check whether `character` is a vowel.
 *
 * @param {string} character - Value.
 * @return {boolean} - Whether `character` is a vowel.
 */
function vowel(character) {
    character = char(character);

    return character === 'A' ||
        character === 'E' ||
        character === 'I' ||
        character === 'O' ||
        character === 'U';
}

/**
 * Check whether `character` would make a `'C'` or `'G'`
 * soft.
 *
 * @param {string} character - Value.
 * @return {boolean} - Whether `character` softens.
 */
function soft(character) {
    character = char(character);

    return character === 'E' ||
        character === 'I' ||
        character === 'Y';
}

/**
 * Check whether `character` would make `'GH'` an `'F'`.
 *
 * @param {string} character - Value.
 * @return {boolean} - Whether `character` hardens.
 */
function noGHToF(character) {
    character = char(character);

    return character === 'B' ||
        character === 'D' ||
        character === 'H';
}

/**
 * Get the phonetics according to the original Metaphone
 * algorithm from a value.
 *
 * @param {string} value - value to detect phonetics for.
 * @return {string} - phonetics.
 */
function metaphone(value) {
    var phonized = '';
    var index = 0;
    var skip;
    var next;
    var current;
    var prev;

    /**
     * Add `characters` to `phonized`.
     *
     * @param {string} characters - Characters to add.
     */
    function phonize(characters) {
        phonized += characters;
    }

    /**
     * Get the character offset by `offset` from the
     * current character.
     *
     * @param {number} offset - Offset from `index`.
     * @return {string} - Character offset from `index` by
     *   `offset`.
     */
    function at(offset) {
        return value.charAt(index + offset).toUpperCase();
    }

    /**
     * Create an `at` function with a bound `offset`.
     *
     * @param {number} offset - Offset from `index`.
     * @return {function(): string} - Function which
     *   returns a character offset from `index` by the
     *   bound `offset`.
     */
    function atFactory(offset) {
        return function () {
            return at(offset);
        }
    }

    value = String(value || '');

    if (!value) {
        return '';
    }

    next = atFactory(1);
    current = atFactory(0);
    prev = atFactory(-1);

    /* Find our first letter */
    while (!alpha(current())) {
        if (!current()) {
            return '';
        }

        index++;
    }

    switch (current()) {
        case 'A':
            /* AE becomes E */
            if (next() === 'E') {
                phonize('E');
                index += 2;
            }

            /* Remember, preserve vowels at the beginning */
            else {
                phonize('A');
                index++;
            }

            break;
        /* [GKP]N becomes N */
        case 'G':
        case 'K':
        case 'P':
            if (next() === 'N') {
                phonize('N');
                index += 2;
            }

            break;

        /* WH becomes H,
           WR becomes R
           W if followed by a vowel */
        case 'W':
            if (next() === 'R') {
                phonize(next());
                index += 2;
            } else if (next() === 'H') {
                phonize(current());
                index += 2;
            } else if (vowel(next())) {
                phonize('W');
                index += 2;
            }
            /* else ignore */
            break;
        /* X becomes S */
        case 'X':
            phonize('S');
            index++;

            break;
        /* Vowels are kept */
        /* We did A already
        case 'A':
        case 'a':
        */
        case 'E':
        case 'I':
        case 'O':
        case 'U':
            phonize(current());
            index++;
            break;
        default:
            /* do nothing */
            break;
    }

    /* On to the metaphoning */
    while (current()) {
        /* How many letters to skip because an eariler encoding handled
         * multiple letters */
        skip = 1;

        /* Ignore non-alphas */
        if (
            !alpha(current()) ||
            (current() === prev() && current() !== 'C')
        ) {
            index += skip;

            continue;
        }

        switch (current()) {
            /* B -> B unless in MB */
            case 'B':
                if (prev() !== 'M') {
                    phonize('B');
                }

                break;
            /* 'sh' if -CIA- or -CH, but not SCH, except SCHW.
             * (SCHW is handled in S)
             *  S if -CI-, -CE- or -CY-
             *  dropped if -SCI-, SCE-, -SCY- (handed in S)
             *  else K
             */
            case 'C':
                if (soft(next())) {
                    /* C[IEY] */

                    if (next() === 'I' && at(2) === 'A') {
                        /* CIA */
                        phonize(SH);
                    } else if (prev() !== 'S') {
                        phonize('S');
                    }
                } else if (next() === 'H') {
                    phonize(SH);

                    skip++;
                } else {
                    /* C */

                    phonize('K');
                }

                break;
            /* J if in -DGE-, -DGI- or -DGY-
             * else T
             */
            case 'D':
                if (next() === 'G' && soft(at(2))) {
                    phonize('J');
                    skip++;
                } else {
                    phonize('T');
                }

                break;
            /* F if in -GH and not B--GH, D--GH, -H--GH, -H---GH
             * else dropped if -GNED, -GN,
             * else dropped if -DGE-, -DGI- or -DGY- (handled in D)
             * else J if in -GE-, -GI, -GY and not GG
             * else K
             */
            case 'G':
                if (next() === 'H') {
                    if (!(noGHToF(at(-3)) || at(-4) === 'H')) {
                        phonize('F');
                        skip++;
                    }
                } else if (next() === 'N') {
                    if (!(
                        !alpha(at(2)) ||
                        (at(2) === 'E' && at(3) === 'D')
                    )) {
                        phonize('K');
                    }
                } else if (soft(next()) && prev() !== 'G') {
                    phonize('J');
                } else {
                    phonize('K');
                }

                break;

            /* H if before a vowel and not after C,G,P,S,T */
            case 'H':
                if (vowel(next()) && !dipthongH(prev())) {
                    phonize('H');
                }

                break;
            /* dropped if after C
             * else K
             */
            case 'K':
                if (prev() !== 'C') {
                    phonize('K');
                }

                break;
            /* F if before H
             * else P
             */
            case 'P':
                if (next() === 'H') {
                    phonize('F');
                } else {
                    phonize('P');
                }

                break;
            /* K
             */
            case 'Q':
                phonize('K');
                break;
            /* 'sh' in -SH-, -SIO- or -SIA- or -SCHW-
             * else S
             */
            case 'S':
                if (next() === 'I' && (at(2) === 'O' || at(2) === 'A')) {
                    phonize(SH);
                } else if (next() === 'H') {
                    phonize(SH);

                    skip++;
                } else {
                    phonize('S');
                }

                break;
            /* 'sh' in -TIA- or -TIO-
             * else 'th' before H
             * else T
             */
            case 'T':
                if (next() === 'I' && (at(2) == 'O' || at(2) === 'A')) {
                    phonize(SH);
                } else if (next() === 'H') {
                    phonize(TH);
                    skip++;
                } else if (!(next() === 'C' && at(2) === 'H')) {
                    phonize('T');
                }

                break;
            /* F */
            case 'V':
                phonize('F');
                break;

            case 'W':
                if (vowel(next())) {
                    phonize('W');
                }

                break;
            /* KS */
            case 'X':
                phonize('KS');

                break;
            /* Y if followed by a vowel */
            case 'Y':
                if (vowel(next())) {
                    phonize('Y');
                }

                break;
            /* S */
            case 'Z':
                phonize('S');

                break;
            /* No transformation */
            case 'F':
            case 'J':
            case 'L':
            case 'M':
            case 'N':
            case 'R':
                phonize(current());

                break;
        }

        index += skip;
    }

    return phonized;
}

/*
 * Expose.
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