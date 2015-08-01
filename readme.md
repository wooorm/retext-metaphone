# retext-metaphone [![Build Status](https://img.shields.io/travis/wooorm/retext-metaphone.svg)](https://travis-ci.org/wooorm/retext-metaphone) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-metaphone.svg)](https://codecov.io/github/wooorm/retext-metaphone)

[**Retext**](https://github.com/wooorm/retext) implementation of the
[Metaphone](http://en.wikipedia.org/wiki/Metaphone) algorithm.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-metaphone
```

**retext-metaphone** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](retext-metaphone.js) and
[compressed](retext-metaphone.min.js).

## Usage

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');
var metaphone = require('retext-metaphone');

retext().use(metaphone).use(function () {
    return function (cst) {
        console.log(inspect(cst));
    };
}).process('A simple English sentence.');
```

Yields:

```text
RootNode[1]
└─ ParagraphNode[1]
   └─ SentenceNode[8]
      ├─ WordNode[1] [data={"phonetics":"A"}]
      │  └─ TextNode: 'A'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"phonetics":"SMPL"}]
      │  └─ TextNode: 'simple'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"phonetics":"ENKLKSH"}]
      │  └─ TextNode: 'English'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"phonetics":"SNTNS"}]
      │  └─ TextNode: 'sentence'
      └─ PunctuationNode: '.'
```

You can also combine it with a stemmer (such as [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer)
or [retext-lancaster-stemmer](https://github.com/wooorm/retext-lancaster-stemmer)).

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');
var metaphone = require('retext-metaphone');
var stemmer = require('retext-porter-stemmer');

retext().use(stemmer).use(metaphone).use(function () {
    return function (cst) {
        console.log(inspect(cst));
    };
}).process('A simple English sentence.');
```

Yields:

```text
RootNode[1]
└─ ParagraphNode[1]
   └─ SentenceNode[6]
      ├─ WordNode[1] [data={"stem":"a","phonetics":"A","stemmedPhonetics":"A"}]
      │  └─ TextNode: 'A'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"stem":"detest","phonetics":"TTSTBL","stemmedPhonetics":"TTST"}]
      │  └─ TextNode: 'detestable'
      ├─ WhiteSpaceNode: ' '
      ├─ WordNode[1] [data={"stem":"paragraph","phonetics":"PRKRF","stemmedPhonetics":"PRKRF"}]
      │  └─ TextNode: 'paragraph'
      └─ PunctuationNode: '.'
```

## API

None, **retext-metaphone** automatically detects the phonetics of each
[`WordNode`](https://github.com/wooorm/nlcst#wordnode) (using [**wooorm/metaphone**](https://github.com/wooorm/metaphone)),
and stores the phonetics in `node.data.phonetics`. If a stemmer is used,
the stemmed phonetics are stored in `node.data.stemmedPhonetics`.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
