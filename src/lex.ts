import { isKeyword } from "./keywords";
import { Reader, Location } from "./reader";
import {
  Token,
  TokenBuilders,
  Operator,
  ParenChar,
  operatorChars,
  operators,
} from "./tokens";
import { ErrorAtLocation } from "./error_at_location";

export default function lex(source: string): Token[] {
  const tokens: Token[] = [];
  const reader = new Reader(source);
  let unclosedParens = 0;

  while (reader.hasMoreChars()) {
    let char = reader.peek();

    if (char === "\n") {
      tokens.push(TokenBuilders.newline(reader.currentLocation()));
      reader.next();
      continue;
    }

    if (isWhitespace(char)) {
      reader.next();
      continue;
    }

    if (isNumeric(char)) {
      const location = reader.currentLocation();
      const value = reader.takeCharsWhile(isNumeric);
      const num = parseInt(value, 10);
      tokens.push(TokenBuilders.number(num, location));
      continue;
    }

    if (isAlpha(char)) {
      const location = reader.currentLocation();
      const value = reader.takeCharsWhile(isAlphaNumeric);
      if (isKeyword(value)) {
        tokens.push(TokenBuilders.keyword(value, location));
      } else {
        tokens.push(TokenBuilders.identifier(value, location));
      }
      continue;
    }

    if (isParen(char)) {
      unclosedParens += isOpeningParen(char) ? 1 : -1;
      const location = reader.currentLocation();
      tokens.push(TokenBuilders.paren(char, location));
      reader.next();
      continue;
    }

    if (isOperatorChar(char)) {
      const location = reader.currentLocation();
      const operator = reader.takeCharsWhile((char, value) => {
        return (
          isOperatorChar(char) &&
          operators.some((operator) => operator.startsWith(value))
        );
      });
      if (!isOperator(operator)) {
        // TODO(christianscott): the error produced here is not clear enough
        throw new LexError(operator, location);
      }

      tokens.push(TokenBuilders.operator(operator, location));
      continue;
    }

    if (char === '"' || char === `'`) {
      const location = reader.currentLocation();
      const quoteKind = char;
      reader.next(); // skip open quote

      const value = reader.takeCharsWhile((s) => s !== quoteKind);
      tokens.push(TokenBuilders.string(value, location));

      if (reader.peek() !== quoteKind) {
        throw new UnexpectedEndOfInputError(reader.currentLocation());
      }

      reader.next(); // skip closing quote
      continue;
    }

    throw new LexError(char, reader.currentLocation());
  }

  if (unclosedParens > 0) {
    throw new UnexpectedEndOfInputError(reader.currentLocation());
  }

  return tokens;
}

export class LexError extends ErrorAtLocation {
  constructor(char: string, location: Location) {
    super(`unexpected char ${char}`, location);
  }
}

export class UnexpectedEndOfInputError extends ErrorAtLocation {
  constructor(location: Location) {
    super("unexpected end of input", location);
  }
}

const parenChars = ["(", ")", "[", "]"];
function isParen(s: string): s is ParenChar {
  return parenChars.includes(s);
}

function isOpeningParen(s: ParenChar): s is "(" | "[" {
  return s === "(" || s === "[";
}

function isWhitespace(s: string): boolean {
  return /\s/.test(s);
}

function isAlphaNumeric(s: string): boolean {
  return isAlpha(s) || isNumeric(s);
}

function isAlpha(s: string): boolean {
  return /[a-z]/i.test(s);
}

function isNumeric(s: string): boolean {
  return /[0-9]/.test(s);
}

function isOperator(s: string): s is Operator {
  return operators.includes(s);
}

function isOperatorChar(s: string): boolean {
  return operatorChars.has(s);
}
