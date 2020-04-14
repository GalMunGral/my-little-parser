const fs = require('fs');
const parser = require('./js-parser');
const src = fs.readFileSync('./input/test.js', { encoding: 'utf8' });
const parseTree = parser(src);
const output = JSON.stringify(parseTree, null, 4)
fs.writeFileSync('./output/js-parse-tree.txt', output);
