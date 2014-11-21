# retext-metaphone [![Build Status](https://img.shields.io/travis/wooorm/retext-metaphone.svg?style=flat)](https://travis-ci.org/wooorm/retext-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-metaphone.svg?style=flat)](https://coveralls.io/r/wooorm/retext-metaphone?branch=master)

**[Retext](https://github.com/wooorm/retext "Retext")** implementation of the [original Metaphone](http://en.wikipedia.org/wiki/Metaphone) algorithm.

## Installation

npm:
```sh
$ npm install retext-metaphone
```

Component:
```sh
$ component install wooorm/retext-metaphone
```

Bower:
```sh
$ bower install retext-metaphone
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    metaphone = require('retext-metaphone'),
    retext;

retext = new Retext()
    .use(visit)
    .use(metaphone);

retext.parse('A simple english sentence.', function (err, tree) {
    tree.visitType(tree.WORD_NODE, function (node) {
        console.log(node.toString(), node.data.phonetics);
    });
    /**
     * 'A', 'A'
     * 'simple', 'SMPL'
     * 'english', 'ENKLKSH'
     * 'sentence', 'SNTNS'
     */
});
```

You can also combine it with a stemmer (such as [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer) or [retext-lancaster-stemmer](https://github.com/wooorm/retext-lancaster-stemmer)).

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    metaphone = require('retext-metaphone'),
    stemmer = require('retext-porter-stemmer'),
    retext;

retext = new Retext()
    .use(visit)
    .use(metaphone)
    .use(stemmer);

retext.parse('A detestable paragraph', function (err, tree) {
    tree.visitType(tree.WORD_NODE, function (node) {
        console.log(node.toString(), node.data.phonetics, node.data.stemmedPhonetics);
    });
    /**
     * 'A', 'A', 'A'
     * 'detestable', 'TTSTBL', 'TTST'
     * 'paragraph', 'PRKRF', 'PRKRF'
     */
});
```

## API

None, the plugin automatically detects the phonetics of each word (using [wooorm/metaphone](https://github.com/wooorm/metaphone)) when it’s created or changed, and stores the phonetics in `wordNode.data.phonetics`.

## License

MIT © Titus Wormer
