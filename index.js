'use strict';

/**
 * Dependencies.
 */

var phonetics;

phonetics = require('metaphone');

/**
 * Change handler
 *
 * @this {WordNode}
 */

function onchange() {
    var data,
        value;

    data = this.data;
    value = this.toString();

    data.phonetics = value ? phonetics(value) : null;

    if ('stem' in data) {
        data.stemmedPhonetics = value ? phonetics(data.stem) : null;
    }
}

/**
 * Define `metaphone`.
 *
 * @param {Retext} retext
 */

function metaphone(retext) {
    var WordNode;

    WordNode = retext.TextOM.WordNode;

    WordNode.on('changetextinside', onchange);
    WordNode.on('removeinside', onchange);
    WordNode.on('insertinside', onchange);
}

/**
 * Expose `metaphone`.
 */

module.exports = metaphone;
