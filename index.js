'use strict';

exports = module.exports = function () {};

var metaphone = require('metaphone');

function onchange() {
    var data = this.data,
        value = this.toString();

    data.phonetics = value ? metaphone(value) : null;

    if ('stem' in data) {
        data.stemmedPhonetics = value ? metaphone(data.stem) : null;
    }
}

function attach(retext) {
    retext.parser.TextOM.WordNode.on('changetextinside', onchange);
    retext.parser.TextOM.WordNode.on('removeinside', onchange);
    retext.parser.TextOM.WordNode.on('insertinside', onchange);
}

exports.attach = attach;
