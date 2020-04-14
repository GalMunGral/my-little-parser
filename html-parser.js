const fs = require('fs');

const Type = {
  SELF_CLOSING_TAG: 'SELF_CLOSING_TAG',
  START_TAG: 'START_TAG',
  END_TAG: 'END_TAG',
  TEXT: 'TEXT',
  NODE: 'NODE'
}

const lexerRegex = /(?<self_closing><(?<sc_tag>\w+)(?<sc_attrs>(\s+\w+=".*?")*)\s*\/>\s*)|(?<start><(?<s_tag>\w+)(?<s_attrs>(\s+\w+=".*?")*)\s*>\s*)|(?<end><\/(?<e_tag>\w+)>)\s*|(?<text>[^<]+)/y;
const attrRegex = /(?<name>\w+)="(?<value>.*?)"/g;

function* lexer(s) {
  s = s.trim();
  while (match = lexerRegex.exec(s)) {
    if (match.groups.self_closing) {
      const { sc_tag: tag, sc_attrs: attrs } = match.groups;
      const attributes = [];
      for (let match of attrs.matchAll(attrRegex)) {
        const { name, value } = match.groups;
        attributes.push({ name, value });
      }
      yield { type: Type.SELF_CLOSING_TAG, tag, attributes }
    } else if (match.groups.start) {
      const { s_tag: tag, s_attrs: attrs } = match.groups;
      const attributes = [];
      for (let match of attrs.matchAll(attrRegex)) {
        const { name, value } = match.groups;
        attributes.push({ name, value });
      }
      yield { type: Type.START_TAG, tag, attributes }
    } else if (match.groups.end) {
      const { e_tag: tag } = match.groups;
      yield { type: Type.END_TAG, tag }
    } else {
      const { text } = match.groups;
      yield { type: Type.TEXT, content: text }
    }
  }
  return;
};

const parser = (s) => {
  const l = lexer(s);
  const stack = [];
  let { value: node , done } = l.next();
  while (!done) {
    switch (node.type) {
      case Type.END_TAG: {
        const children = [];
        let cur;
        while (cur = stack.pop(), cur.tag !== node.tag) {
          children.push(cur);
        }
        const { tag, attributes } = cur;
        children.reverse();
        stack.push({ type: Type.NODE, tag, attributes, children });
        break;
      }
      case Type.SELF_CLOSING_TAG: {
        node.type = Type.NODE;
        stack.push(node);
        break;
      }
      default:
        stack.push(node);
    }
    ({ value: node, done } = l.next());
  }
  return stack;
}

module.exports = parser;