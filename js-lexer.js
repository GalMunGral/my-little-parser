const { Type } = require('./js-spec');

function* lexer(s) {
  s = s.trim();
  const lexerRegex = /(?<token>\d+|[a-zA-Z]+|[+\-*/]|[=<>(){},;]|<=|>=|==)\s*/y;
  while (match = lexerRegex.exec(s)) {
    const { groups: { token } } = match;
    switch (token) {
      case '+':
      case '-':
        yield { type: Type.additiveOperator, value: token }; break;
      case '*':
      case '/':
        yield { type: Type.multiplicativeOperator, value: token }; break;
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
        yield { type: Type.comparisonOperator, value: token }; break;
      case '=':
        yield { type: Type.assignmentOperator }; break;
      case '(':
        yield { type: Type.leftParenthesis }; break;
      case ')':
        yield { type: Type.rightParenthesis }; break;
      case '{':
        yield { type: Type.leftCurlyBracket }; break;
      case '}':
        yield { type: Type.rightCurlyBracket }; break;
      case ';':
        yield { type: Type.semicolon }; break;
      case ',':
        yield { type: Type.comma }; break;
      case 'function':
        yield { type: Type.functionKeyword }; break;
      case 'var':
      case 'let':
      case 'const':
        yield { type: Type.variableKeyword, value: token }; break;
      case 'if':
        yield { type: Type.conditionalKeyword }; break;
      case 'else':
        yield { type: Type.alternativeKeyword }; break;
      case 'return':
        yield { type: Type.returnKeyword }; break;
      default:
        if (Number.isNaN(Number(token))) {
          yield { type: Type.identifier, value: token };
        } else {
          yield { type: Type.number, vlaue: token };
        }
    }
  }
  return;
};

module.exports = lexer;
