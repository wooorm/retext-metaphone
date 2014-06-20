'use strict';

exports = module.exports = function () {};

var metaphone = require('metaphone');

function onchangetext(value) {
    var data = this.data;
    data.phonetics = value ? metaphone(value) : null;
    if ('stem' in data) {
        data.stemmedPhonetics = value ? metaphone(data.stem) : null;
    }
}

function attach(retext) {
    retext.parser.TextOM.WordNode.on('changetext', onchangetext);
}

exports.attach = attach;
