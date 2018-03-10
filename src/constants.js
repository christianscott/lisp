const NUMBER = 'NUMBER'
const STRING = 'STRING'
const PAREN = 'PAREN'
const OPERATOR = 'OPERATOR'
const IDENTIFIER = 'IDENTIFIER'
const KEYWORD = 'KEYWORD'

const PROGRAM = 'PROGRAM'
const NUMBER_LITERAL = 'NUMBER_LITERAL'
const STRING_LITERAL = 'STRING_LITERAL'
const CALL_EXPRESSION = 'CALL_EXPRESSION'
const VARIABLE_ASSIGNMENT = 'VARIABLE_ASSIGNMENT'

const KEYWORDS = {
  def: VARIABLE_ASSIGNMENT,
}

const DEFAULT_GLOBALS = {
  print: console.log.bind(console),
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  'pow': (a, b) => a ** b
}

module.exports = {
  NUMBER,
  STRING,
  PAREN,
  OPERATOR,
  IDENTIFIER,
  KEYWORD,

  KEYWORDS,

  PROGRAM,
  NUMBER_LITERAL,
  STRING_LITERAL,
  CALL_EXPRESSION,
  VARIABLE_ASSIGNMENT,

  DEFAULT_GLOBALS
}
