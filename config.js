const Type = {
  block: 'block',
  number: 'number',
  identifier: 'identifier',
  subexpression: 'subexpression',
  completeExpression: 'completeExpression',
  additiveOperator: 'additiveOperator',
  multiplicativeOperator: 'multiplicativeOperator',
  comparisonOperator: 'comparisonOperator',
  assignmentOperator: 'assignmentOperator',
  leftParenthesis: 'leftParenthesis',
  rightParenthesis: 'rightParenthesis',
  leftCurlyBracket: 'leftCurlyBracket',
  rightCurlyBracket: 'rightCurlyBracket',
  semicolon: 'semicolon',
  comma: 'comma',
  functionParameters: 'functionParameters',
  functionArguments: 'functionArguments',
  functionKeyword: 'functionKeyword',
  variableKeyword: 'variableKeyword',
  conditionalKeyword: 'conditionalKeyword',
  alternativeKeyword: 'alternativeKeyword',
  returnKeyword: 'returnKeyword',
  assignmentStatement: 'assignmentStatement',
  conditionalStatement: 'conditionalStatement',
  returnStatement: 'returnStatement',
  functionDeclaration: 'functionDeclaration',
  functionApplication: 'functionApplication',
}

const State = {
  reduce: {
    block: 'reduce.block',
    subexpression: 'reduce.subexpression',
    multiplicativeTerm: 'reduce.multiplicativeTerm',
    completeExpression: 'reduce.completeExpression',
    assignment: 'reduce.assignment',
    conditional: 'reduce.conditional',
    returnStatement: 'reduce.returnStatement',
    functionArguments: 'reduce.functionArguments',
    functionDeclaration: 'reduce.functionDeclaration',
    functionApplication: 'reduce.functionApplication',
  },
  block: 'block',
  assignment: {
      afterDeclarationKeyword: 'assignment.afterDeclarationKeyword',
      afterVariableName: 'assignment.afterVariableName',
      afterAssignmentOperator: 'assignment.afterAssignmentOperator',
  },
  expression: {
    beforeFirstOperand: 'expression.beforeFirstOperand',
    afterAdditiveOperator: 'expression.afterAdditiveOperator',
    afterAdditiveOperand: 'expression.afterAdditiveOperand',
    afterMultiplicativeOperator: 'expression.afterMultiplicativeOperator',
    afterMultiplicativeOperand: 'expression.afterMultiplicativeOperand',
  },
  conditional: {
    afterKeyword: 'conditional.afterKeyword',
    beforePredicate: 'conditional.beforePredicate',
    predicate: {
      afterLeftOperand: 'conditional.predicate.afterLeftOperand',
      afterComparisonOperator: 'conditional.predicate.afterComparisonOperator',
      afterRightOperand: 'conditional.predicate.afterRightOperand',
    },
    beforeConsequent: 'conditional.beforeConsequent',
    afterConsequent: 'conditional.afterConsequent',
    beforeAlternative: 'conditional.beforeAlternative',
  },
  returnStatement: {
    afterKeyword: 'returnStatement.afterKeyword',
  },
  functionDeclaration: {
    afterKeyword: 'functionDeclaration.afterKeyword',
    afterFunctionName: 'functionDeclaration.afterFunctionName',
    beforeFirstArgument: 'functionDeclaration.beforeFirstArgument',
    beforeArgument: 'functionDeclaration.beforeArgument',
    afterArgument: 'functionDeclaration.afterArgument',
    beforeBody: 'functionDeclaration.beforeBody',
  },
  functionApplication: {
    afterFunctionName: 'functionApplication.afterFunctionName',
    beforeFirstArgument: 'functionApplication.beforeFirstArgument',
    beforeArgument: 'functionApplication.beforeArgument',
    afterArgument: 'functionApplication.afterArgument',
  }
}

const transitionTable = {
  [State.block]: {
    [Type.identifier]: State.assignment.afterVariableName,
    [Type.variableKeyword]: State.assignment.afterDeclarationKeyword,
    [Type.functionKeyword]: State.functionDeclaration.afterKeyword,
    [Type.conditionalKeyword]: State.conditional.afterKeyword,
    [Type.returnKeyword]:State.returnStatement.afterKeyword,
    [Type.assignmentStatement]: State.block,
    [Type.conditionalStatement]: State.block,
    [Type.returnStatement]: State.block,
    [Type.functionDeclaration]: State.block,
    [Type.rightCurlyBracket]: State.reduce.block,
  },
  [State.assignment.afterDeclarationKeyword]: {
    [Type.identifier]: State.assignment.afterVariableName
  },
  [State.assignment.afterVariableName]: {
    [Type.assignmentOperator]: State.assignment.afterAssignmentOperator,
    [Type.leftParenthesis]: State.functionApplication.beforeFirstArgument,
  },
  [State.assignment.afterAssignmentOperator]: {
    [Type.number]: State.expression.afterAdditiveOperand,
    [Type.identifier]: State.expression.afterAdditiveOperand,
    [Type.subexpression]: State.expression.afterAdditiveOperand,
    [Type.LeftParenthesis]: State.expression.beforeFirstOperand,
    [Type.completeExpression]: State.reduce.assignment
  },
  [State.expression.beforeFirstOperand]: {
    [Type.number]: State.expression.afterAdditiveOperand,
    [Type.identifier]: State.expression.afterAdditiveOperand,
    [Type.leftParenthesis]: State.expression.beforeFirstOperand,
    [Type.subexpression]: State.expression.afterAdditiveOperand,
  },
  [State.expression.afterAdditiveOperand]: {
    [Type.additiveOperator]: State.expression.afterAdditiveOperator,
    [Type.multiplicativeOperator]: State.expression.afterMultiplicativeOperator,
    [Type.leftParenthesis]: State.functionApplication.beforeFirstArgument,
    [Type.rightParenthesis]: State.reduce.subexpression,
    [Type.semicolon]: State.reduce.completeExpression,
  },
  [State.expression.afterMultiplicativeOperand]: {
    [Type.additiveOperator]: State.reduce.multiplicativeTerm,
    [Type.multiplicativeOperator]: State.reduce.multiplicativeTerm,
    [Type.semicolon]: State.reduce.completeExpression,
    [Type.LeftParenthesis]: State.functionApplication.beforeFirstArgument,
    [Type.rightParenthesis]: State.reduce.subexpression,
  },
  [State.expression.afterAdditiveOperator]: {
    [Type.number]: State.expression.afterAdditiveOperand,
    [Type.identifier]: State.expression.afterAdditiveOperand,
    [Type.subexpression]: State.expression.afterAdditiveOperand,
    [Type.leftParenthesis]: State.expression.beforeFirstOperand,
  },
  [State.expression.afterMultiplicativeOperator]: {
    [Type.number]: State.expression.afterMultiplicativeOperand,
    [Type.identifier]: State.expression.afterMultiplicativeOperand,
    [Type.subexpression]: State.expression.afterMultiplicativeOperand,
    [Type.leftParenthesis]: State.expression.beforeFirstOperand,
  },
  [State.conditional.afterKeyword]: {
    [Type.leftParenthesis]: State.conditional.beforePredicate,
  },
  [State.conditional.beforePredicate]: {
    [Type.number]: State.conditional.predicate.afterLeftOperand,
    [Type.identifier]: State.conditional.predicate.afterLeftOperand,
  },
  [State.conditional.predicate.afterLeftOperand]: {
    [Type.comparisonOperator]: State.conditional.predicate.afterComparisonOperator,
  },
  [State.conditional.predicate.afterComparisonOperator]: {
    [Type.number]: State.conditional.predicate.afterRightOperand,
    [Type.identifier]: State.conditional.predicate.afterRightOperand,
  },
  [State.conditional.predicate.afterRightOperand]: {
    [Type.rightParenthesis]: State.conditional.beforeConsequent,
  },
  [State.conditional.beforeConsequent]: {
    [Type.leftCurlyBracket]: State.block,
    [Type.block]: State.conditional.afterConsequent,
  },
  [State.conditional.afterConsequent]: {
    [Type.alternativeKeyword]: State.conditional.beforeAlternative,
  },
  [State.conditional.beforeAlternative]: {
    [Type.leftCurlyBracket]: State.block,
    [Type.block]: State.reduce.conditional
  },
  [State.returnStatement.afterKeyword]: {
    [Type.number]: State.expression.afterAdditiveOperand,
    [Type.identifier]: State.expression.afterAdditiveOperand,
    [Type.subexpression]: State.expression.afterAdditiveOperand,
    [Type.LeftParenthesis]: State.expression.beforeFirstOperand,
    [Type.completeExpression]: State.reduce.returnStatement,
  },
  [State.functionDeclaration.afterKeyword]: {
    [Type.identifier]: State.functionDeclaration.afterFunctionName,
  },
  [State.functionDeclaration.afterFunctionName]: {
    [Type.leftParenthesis]: State.functionDeclaration.beforeFirstArgument,
    [Type.functionArguments]: State.functionDeclaration.beforeBody,
  },
  [State.functionDeclaration.beforeFirstArgument]: {
    [Type.identifier]: State.functionDeclaration.afterArgument
  },
  [State.functionDeclaration.beforeArgument]: {
    [Type.identifier]: State.functionDeclaration.afterArgument
  },
  [State.functionDeclaration.afterArgument]: {
    [Type.comma]: State.functionDeclaration.beforeArgument,
    [Type.rightParenthesis]: State.reduce.functionArguments
  },
  [State.functionDeclaration.beforeBody]: {
    [Type.leftCurlyBracket]: State.block,
    [Type.block]: State.reduce.functionDeclaration
  },
  [State.functionApplication.beforeFirstArgument]: {
    [Type.number]: State.functionApplication.afterArgument,
    [Type.identifier]: State.functionApplication.afterArgument
  },
  [State.functionApplication.beforeArgument]: {
    [Type.number]: State.functionApplication.afterArgument,
    [Type.identifier]: State.functionApplication.afterArgument
  },
  [State.functionApplication.afterArgument]: {
    [Type.comma]: State.functionApplication.beforeArgument,
    [Type.rightParenthesis]: State.reduce.functionApplication
  }
}

module.exports = { Type, State, transitionTable };
