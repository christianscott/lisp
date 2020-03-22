import { Keyword } from "./keywords";
import { Location } from "./reader";

export type OperatorChar = "+" | "-" | "*" | "/" | '>' | '<' | '>=' | '<=' | '=';

// hack to get an exhaustive array over a union
const _operatorChars: Record<OperatorChar, null> = {
  '+': null,
  '-': null,
  '*': null,
  '/': null,
  '>': null,
  '<': null,
  '>=': null,
  '<=': null,
  '=': null,
};
export const operatorChars = Object.keys(_operatorChars);

export type ParenChar = '(' | ')' | '[' | ']';

export enum TokenKind {
  NUMBER = "NUMBER",
  STRING = "STRING",
  PAREN = "PAREN",
  OPERATOR = "OPERATOR",
  IDENTIFIER = "IDENTIFIER",
  KEYWORD = "KEYWORD",
  NEWLINE = "NEWLINE"
}

export type Token = { location: Location } & (
  | { type: TokenKind.NUMBER; value: string }
  | { type: TokenKind.STRING; value: string }
  | { type: TokenKind.IDENTIFIER; value: string }
  | { type: TokenKind.PAREN; value: ParenChar }
  | { type: TokenKind.KEYWORD; value: Keyword }
  | { type: TokenKind.OPERATOR; value: OperatorChar }
  | { type: TokenKind.NEWLINE }
);

export type IdentifierToken = Extract<Token, { type: TokenKind.IDENTIFIER }>;

export type OperatorToken = Extract<Token, { type: TokenKind.OPERATOR }>;

export type KeywordToken = Extract<Token, { type: TokenKind.KEYWORD }>;

export const TokenBuilders = {
  paren(value: ParenChar, location: Location): Token {
    return { type: TokenKind.PAREN, location, value };
  },
  number(value: string, location: Location): Token {
    return { type: TokenKind.NUMBER, location, value };
  },
  operator(value: OperatorChar, location: Location): Token {
    return { type: TokenKind.OPERATOR, location, value };
  },
  identifier(value: string, location: Location): Token {
    return { type: TokenKind.IDENTIFIER, location, value };
  },
  string(value: string, location: Location): Token {
    return { type: TokenKind.STRING, location, value };
  },
  keyword(value: Keyword, location: Location): Token {
    return { type: TokenKind.KEYWORD, location, value };
  },
  newline(location: Location): Token {
    return { type: TokenKind.NEWLINE, location };
  }
};
