# retext-metaphone [![Build Status](https://img.shields.io/travis/wooorm/retext-metaphone.svg?style=flat)](https://travis-ci.org/wooorm/retext-metaphone) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-metaphone.svg?style=flat)](https://coveralls.io/r/wooorm/retext-metaphone?branch=master)

**[Retext](https://github.com/wooorm/retext)** implementation of the [Metaphone](http://en.wikipedia.org/wiki/Metaphone) algorithm.

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
var Retext = require('retext');
var visit = require('retext-visit');
var inspect = require('retext-inspect');
var metaphone = require('retext-metaphone');

var retext = new Retext()
    .use(inspect)
    .use(visit)
    .use(metaphone);

retext.parse('A simple english sentence.', function (err, tree) {
    tree.visit(tree.WORD_NODE, function (node) {
        console.log(node);
    });
    /*
     * WordNode[1] [data={"phonetics":"A"}]
     * └─ TextNode: 'A'
     * WordNode[1] [data={"phonetics":"SMPL"}]
     * └─ TextNode: 'simple'
     * WordNode[1] [data={"phonetics":"ENKLKSH"}]
     * └─ TextNode: 'english'
     * WordNode[1] [data={"phonetics":"SNTNS"}]
     * └─ TextNode: 'sentence'
     */
});
```

You can also combine it with a stemmer (such as [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer) or [retext-lancaster-stemmer](https://github.com/wooorm/retext-lancaster-stemmer)).

```js
var Retext = require('retext');
var visit = require('retext-visit');
var inspect = require('retext-inspect');
var metaphone = require('retext-metaphone');
var stemmer = require('retext-porter-stemmer');

var retext = new Retext()
    .use(inspect)
    .use(visit)
    .use(metaphone)
    /* make sure to attach the stemmer after metaphone. */
    .use(stemmer);

retext.parse('A detestable paragraph.', function (err, tree) {
    tree.visit(tree.WORD_NODE, function (node) {
        console.log(node);
    });
    /*
     * WordNode[1] [data={"stem":"a","phonetics":"A","stemmedPhonetics":"A"}]
     * └─ TextNode: 'A'
     * WordNode[1] [data={"stem":"detest","phonetics":"TTSTBL","stemmedPhonetics":"TTST"}]
     * └─ TextNode: 'detestable'
     * WordNode[1] [data={"stem":"paragraph","phonetics":"PRKRF","stemmedPhonetics":"PRKRF"}]
     * └─ TextNode: 'paragraph'
     */
});
```

## API

None, **retext-metaphone** automatically detects the phonetics of each [`WordNode`](https://github.com/wooorm/textom#textomwordnode-nlcstwordnode) (using **[wooorm/metaphone](https://github.com/wooorm/metaphone)**), and stores the phonetics in `node.data.phonetics`. If a stemmer is used, the stemmed phonetics are stored in `node.data.stemmedPhonetics`.

## Performance

On a MacBook Air, **retext** performs about 24% slower with **retext-metaphone**.

```
           retext w/o retext-metaphone
  225 op/s » A paragraph (5 sentences, 100 words)
   25 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)

           retext w/ retext-metaphone
  171 op/s » A paragraph (5 sentences, 100 words)
   16 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
