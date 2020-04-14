const Type = {
  block: Symbol('block'),
  number: Symbol('number'),
  identifier: Symbol('identifier'),
  subexpression: Symbol('subexpression'),
  completeExpression: Symbol('completeExpression'),
  additiveOperator: Symbol('additiveOperator'),
  multiplicativeOperator: Symbol('multiplicativeOperator'),
  comparisonOperator: Symbol('comparisonOperator'),
  assignmentOperator: Symbol('assignmentOperator'),
  leftParenthesis: Symbol('leftParenthesis'),
  rightParenthesis: Symbol('rightParenthesis'),
  leftCurlyBracket: Symbol('leftCurlyBracket'),
  rightCurlyBracket: Symbol('rightCurlyBracket'),
  semicolon: Symbol('semicolon'),
  comma: Symbol('comma'),
  functionParameters: Symbol('functionParameters'),
  functionArguments: Symbol('functionArguments'),
  functionKeyword: Symbol('functionKeyword'),
  variableKeyword: Symbol('variableKeyword'),
  conditionalKeyword: Symbol('conditionalKeyword'),
  alternativeKeyword: Symbol('alternativeKeyword'),
  returnKeyword: Symbol('returnKeyword'),
  assignmentStatement: Symbol('assignmentStatement'),
  conditionalStatement: Symbol('conditionalStatement'),
  returnStatement: Symbol('returnStatement'),
  functionDeclaration: Symbol('functionDeclaration'),
  functionApplication: Symbol('functionApplication'),
}

const State = {
  reduce: {
    block: Symbol('reduce.block'),
    subexpression: Symbol('reduce.subexpression'),
    multiplicativeTerm: Symbol('reduce.multiplicativeTerm'),
    completeExpression: Symbol('reduce.completeExpression'),
    assignment: Symbol('reduce.assignment'),
    conditional: Symbol('reduce.conditional'),
    returnStatement: Symbol('reduce.returnStatement'),
    functionArguments: Symbol('reduce.functionArguments'),
    functionDeclaration: Symbol('reduce.functionDeclaration'),
    functionApplication: Symbol('reduce.functionApplication'),
  },
  block: Symbol('block'),
  assignment: {
      afterDeclarationKeyword: Symbol('assignment.afterDeclarationKeyword'),
      afterVariableName: Symbol('assignment.afterVariableName'),
      afterAssignmentOperator: Symbol('assignment.afterAssignmentOperator'),
  },
  expression: {
    beforeFirstOperand: Symbol('expression.beforeFirstOperand'),
    afterAdditiveOperator: Symbol('expression.afterAdditiveOperator'),
    afterAdditiveOperand: Symbol('expression.afterAdditiveOperand'),
    afterMultiplicativeOperator: Symbol('expression.afterMultiplicativeOperator'),
    afterMultiplicativeOperand: Symbol('expression.afterMultiplicativeOperand')
  },
  conditional: {
    afterKeyword: Symbol('conditional.afterKeyword'),
    beforePredicate: Symbol('conditional.beforePredicate'),
    predicate: {
      afterLeftOperand: Symbol('conditional.predicate.afterLeftOperand'),
      afterComparisonOperator: Symbol('conditional.predicate.afterComparisonOperator'),
      afterRightOperand: Symbol('conditional.predicate.afterRightOperand')
    },
    beforeConsequent: Symbol('conditional.beforeConsequent'),
    afterConsequent: Symbol('conditional.afterConsequent'),
    beforeAlternative: Symbol('conditional.beforeAlternative')
  },
  returnStatement: {
    afterKeyword: Symbol('returnStatement.afterKeyword'),
  },
  functionDeclaration: {
    afterKeyword: Symbol('functionDeclaration.afterKeyword'),
    afterFunctionName: Symbol('functionDeclaration.afterFunctionName'),
    beforeFirstArgument: Symbol('functionDeclaration.beforeFirstArgument'),
    beforeArgument: Symbol('functionDeclaration.beforeArgument'),
    afterArgument: Symbol('functionDeclaration.afterArgument'),
    beforeBody: Symbol('functionDeclaration.beforeBody')
  },
  functionApplication: {
    afterFunctionName: Symbol('functionApplication.afterFunctionName'),
    beforeFirstArgument: Symbol('functionApplication.beforeFirstArgument'),
    beforeArgument: Symbol('functionApplication.beforeArgument'),
    afterArgument: Symbol('functionApplication.afterArgument')
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
