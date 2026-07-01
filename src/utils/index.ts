const PRICE_PER_PIECE = 0.20;

export interface MathResult {
  isValid: boolean;
  value: number;
  error?: string;
  money: number;
}

export function evaluateMathExpression(expression: string): MathResult {
  if (!expression || expression.trim() === '') {
    return { isValid: false, value: 0, error: 'Ingrese una cantidad u operación', money: 0 };
  }

  const sanitized = expression.trim();

  const validChars = /^[0-9+\-*/().\s]+$/;
  if (!validChars.test(sanitized)) {
    return { isValid: false, value: 0, error: 'Caracteres no válidos. Use solo números y operadores (+, -, *, /, (, ))', money: 0 };
  }

  const balancedParens = checkBalancedParentheses(sanitized);
  if (!balancedParens) {
    return { isValid: false, value: 0, error: 'Paréntesis incorrectos', money: 0 };
  }

  const dangerousPatterns = /(\+\+|--|\*\*|\/\/|\*\/|\/\*|\+-|-\+)/;
  if (dangerousPatterns.test(sanitized.replace(/\s/g, ''))) {
    return { isValid: false, value: 0, error: 'Operación no válida. Revise la expresión ingresada.', money: 0 };
  }

  if (/[+\-*\/]$/.test(sanitized.trim()) || /^[+\-*\/]/.test(sanitized.trim())) {
    return { isValid: false, value: 0, error: 'Operación incompleta', money: 0 };
  }

  try {
    const result = safeEvaluate(sanitized);

    if (result === null || !isFinite(result)) {
      return { isValid: false, value: 0, error: 'Operación no válida. Revise la expresión ingresada.', money: 0 };
    }

    if (result < 0) {
      return { isValid: false, value: 0, error: 'El resultado no puede ser negativo', money: 0 };
    }

    if (!Number.isInteger(result)) {
      return { isValid: false, value: 0, error: 'El resultado debe ser un número entero', money: 0 };
    }

    const money = Number((result * PRICE_PER_PIECE).toFixed(2));

    return { isValid: true, value: result, money };
  } catch {
    return { isValid: false, value: 0, error: 'Operación no válida. Revise la expresión ingresada.', money: 0 };
  }
}

function checkBalancedParentheses(expr: string): boolean {
  let count = 0;
  for (const char of expr) {
    if (char === '(') count++;
    if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

function safeEvaluate(expr: string): number | null {
  try {
    const tokens = tokenize(expr);
    const result = parseExpression(tokens);

    if (tokens.length > 0) {
      throw new Error('Invalid expression');
    }

    return Math.floor(result);
  } catch {
    return null;
  }
}

function tokenize(expr: string): (string | number)[] {
  const tokens: (string | number)[] = [];
  let currentNumber = '';
  let i = 0;

  while (i < expr.length) {
    const char = expr[i];

    if (char >= '0' && char <= '9') {
      currentNumber += char;
    } else {
      if (currentNumber !== '') {
        tokens.push(parseInt(currentNumber, 10));
        currentNumber = '';
      }

      if (char === '+' || char === '-' || char === '*' || char === '/' || char === '(' || char === ')') {
        tokens.push(char);
      } else if (char !== ' ') {
        throw new Error(`Invalid character: ${char}`);
      }
    }
    i++;
  }

  if (currentNumber !== '') {
    tokens.push(parseInt(currentNumber, 10));
  }

  return tokens;
}

function parseExpression(tokens: (string | number)[]): number {
  return parseAddSub(tokens);
}

function parseAddSub(tokens: (string | number)[]): number {
  let left = parseMulDiv(tokens);

  while (tokens.length > 0 && (tokens[0] === '+' || tokens[0] === '-')) {
    const op = tokens.shift() as string;
    const right = parseMulDiv(tokens);
    left = op === '+' ? left + right : left - right;
  }

  return left;
}

function parseMulDiv(tokens: (string | number)[]): number {
  let left = parsePrimary(tokens);

  while (tokens.length > 0 && (tokens[0] === '*' || tokens[0] === '/')) {
    const op = tokens.shift() as string;
    const right = parsePrimary(tokens);
    if (op === '*') {
      left = left * right;
    } else {
      if (right === 0) {
        throw new Error('Division by zero');
      }
      left = left / right;
    }
  }

  return left;
}

function parsePrimary(tokens: (string | number)[]): number {
  if (tokens.length === 0) {
    throw new Error('Unexpected end of expression');
  }

  const token = tokens.shift();

  if (typeof token === 'number') {
    return token;
  }

  if (token === '(') {
    const result = parseExpression(tokens);
    if (tokens[0] !== ')') {
      throw new Error('Missing closing parenthesis');
    }
    tokens.shift();
    return result;
  }

  throw new Error(`Unexpected token: ${token}`);
}
