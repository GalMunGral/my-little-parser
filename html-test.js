const fs = require('fs');
const parser = require('./html-parser');
const src = fs.readFileSync('./input/test.html', { encoding: 'utf8' });
const parseTree = parser(src);
const output = JSON.stringify(parseTree, null, 4)
fs.writeFileSync('./output/html-parse-tree.txt', output);
