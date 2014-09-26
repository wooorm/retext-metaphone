'use strict';

/**
 * Dependencies.
 */

var phonetics;

phonetics = require('metaphone');

/**
 * Define `metaphone`.
 */

function metaphone() {}

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
 * Define `attach`.
 *
 * @param {Retext} retext
 */

function attach(retext) {
    var WordNode;

    WordNode = retext.TextOM.WordNode;

    WordNode.on('changetextinside', onchange);
    WordNode.on('removeinside', onchange);
    WordNode.on('insertinside', onchange);
}

/**
 * Expose `attach`.
 */

metaphone.attach = attach;

/**
 * Expose `metaphone`.
 */

module.exports = metaphone;
