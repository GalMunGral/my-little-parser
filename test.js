const parser = require('./parser');

const fs = require('fs');
const src = fs.readFileSync('./input/test.js', { encoding: 'utf8' });

const parseTree = parser(src);

const output = JSON.stringify(parseTree, null, 4)
fs.writeFileSync('./output/test-parse-tree.txt', output);
