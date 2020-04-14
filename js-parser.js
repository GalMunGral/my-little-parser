const { Type, State, transitionTable } = require('./js-spec');
const lexer = require('./js-lexer');

const peek = (stack) => stack[stack.length - 1];

const parser = (s) => {
  const l = lexer(s);
  const stack = [{ state: State.block }];
  let { value: nextToken , done } = l.next();

  while (true) {

    console.log('TOP:', stack.length, peek(stack));

    switch (peek(stack).state) {
      case State.reduce.block:
        reduceBlock(); break;
      case State.reduce.multiplicativeTerm:
        reduceMultiplicativeTerm(); break;
      case State.reduce.subexpression: 
        reduceSubexpression(); break;
      case State.reduce.completeExpression:
        reduceCompleteExpression(); break; 
      case State.reduce.assignment:
        reduceAssignment(); break;
      case State.reduce.conditional:
        reduceConditional(); break;
      case State.reduce.returnStatement:
        reduceReturnStatement(); break;
      case State.reduce.functionArguments:
        reduceFunctionArguments(); break;
      case State.reduce.functionDeclaration:
        reduceFunctionDeclaration(); break;
      case State.reduce.functionApplication:
        reduceFunctionApplication(); break;
      default: {
        if (done) return stack;
        const state = transitionTable[peek(stack).state][nextToken.type];
        console.log(`INPUT: ${nextToken.type}\n NEW STATE: ${state} \n`);
        stack.push({ state, node: nextToken });
        ({ value: nextToken , done } = l.next());
      }
    }
  }

  function reduceBlock() {
    stack.pop();
    const statements = [];
    while (peek(stack).state === State.block) {
      const node = stack.pop().node;
      if (node.type != Type.leftCurlyBracket) {
        statements.push(node);
      }
    }
    statements.reverse();
    stack.push({
      state: transitionTable[peek(stack).state][Type.block],
      node: { type: Type.block, statements }
    });
  }

  function reduceMultiplicativeTerm() {
    const rightOperand = stack.pop().node;
    if (peek(stack).node.type !== Type.multiplicativeOperator) {
      stack.push({
        state: State.expression.afterAdditiveOperand,
        node: rightOperand
      }); 
    } else {
      const operator = stack.pop().node;
      const leftOperand = stack.pop().node;
      stack.push({
        state: State.expression.afterAdditiveOperand,
        node: { type: Type.subexpression, operator, leftOperand, rightOperand }
      });  
    }
    console.log('reduceMultiplicativeTerm');
  }

  function reduceAdditiveTerm() {
    const temp = [];
    let prevState
    while (
      prevState = peek(stack).state,
      prevState !== State.expression.beforeFirstOperand &&
      prevState !== State.assignment.afterAssignmentOperator &&
      prevState !== State.returnStatement.afterKeyword
    ) {
      temp.push(stack.pop().node);
    }
    if (temp.length === 1) {
      stack.push({
        state: State.afterAdditiveOperand,
        node: temp[0]
      });
    } else {
      let leftOperand = temp.pop();
      let operator = temp.pop();
      let rightOperand = temp.pop();
      let cur = {
        type: Type.subexpression,
        operator, leftOperand, rightOperand
      };
      while (temp.length) {
        leftOperand = cur;
        operator = temp.pop().node;
        rightOperand = temp.pop().node;
        cur = {
          type: Type.subexpression,
          operator, leftOperand, rightOperand
        };
      }
      stack.push({
        state: State.expression.afterAdditiveOperand,
        node: cur
      });
    }
    console.log('reduceAdditiveTerm');
  }

  function reduceSubexpression() {
    stack.pop();
    reduceMultiplicativeTerm();
    reduceAdditiveTerm();
    const cur = stack.pop().node;
    stack.pop();
    stack.push({
      state: transitionTable[peek(stack).state][Type.subexpression],
      node: cur
    });
    console.log('reduceSubexpression');
  }

  function reduceCompleteExpression() {
    stack.pop();
    reduceMultiplicativeTerm();
    reduceAdditiveTerm();
    const cur = stack.pop().node;
    cur.type = Type.completeExpression;
    stack.push({ state: transitionTable[peek(stack).state][Type.completeExpression], node: cur });
    console.log('reduceCompleteExpression');
  }

  function reduceAssignment() {
    const value = stack.pop().node;
    stack.pop();
    const name = stack.pop().node.value;
    const cur = { type: Type.assignmentStatement, name, value }
    if (peek(stack).state === State.assignment.afterDeclarationKeyword) {
      cur.declarationType = stack.pop().node.value
    }
    stack.push({ state: State.block, node: cur });
    console.log('reduceAssignment');
  }

  function reduceConditional() {
    const alternative = stack.pop().node;
    stack.pop();
    const consequent = stack.pop().node;
    const predicate = stack.pop().node;
    stack.pop();
    stack.push({
      state: State.block,
      node: { type: Type.conditionalStatement, predicate, consequent, alternative }
    });
    console.log('reduceConditional');
  }

  function reduceReturnStatement() {
    const value = stack.pop().node;
    stack.pop();
    stack.push({
      state: State.block,
      node: { type: Type.returnStatement, value }
    });
    console.log('reduceReturnStatement');
  }

  function reduceFunctionArguments() {
    stack.pop();
    const parameters = [];
    while (peek(stack).state !== State.functionDeclaration.afterFunctionName) {
      const cur = stack.pop().node;
      if (cur.type === Type.comma || cur.type === Type.leftParenthesis) continue;
      parameters.push(cur);
    }
    parameters.reverse();
    stack.push({
      state: State.functionDeclaration.beforeBody,
      node: parameters
    });
    console.log('reduceFunctionArguments');
  }

  function reduceFunctionDeclaration() {
    const body = stack.pop().node;
    const parameters = stack.pop().node;
    const name = stack.pop().node.value;
    stack.pop();
    stack.push({
      state: State.block,
      node: { type: Type.functionDeclaration, name, parameters, body }
    })
    console.log('reduceFunctionDeclaration');
  }

  function reduceFunctionApplication() {
    stack.pop();
    const arguments = [];
    while (peek(stack).state !== State.functionApplication.beforeFirstArgument) {
      const cur = stack.pop().node;
      if (cur.type === Type.comma || cur.type === Type.leftParenthesis) continue;
      arguments.push(cur);
    }
    arguments.reverse();
    stack.pop();
    const functionName = stack.pop().node.value;
    stack.push({
      state: transitionTable[peek(stack).state][Type.subexpression],
      node: { type: Type.subexpression, functionName, arguments}
    })
    console.log('reduceFunctionApplication');
  }
}

module.exports = parser;
