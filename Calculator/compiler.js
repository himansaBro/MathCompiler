/*
  Sections: helpers, lexer (tokenize), implicit multiplication, bracket parsing, AST generation
*/

let inData = "12+7*(3.5/1.4)-(8+2.25*3)+(4/(2+1.5)*(6-0.75))+((10*2.5)/(5-3))+((7+3.2)*(1.5/0.5))+((12-4.5)*(2+3.25))/5+6*(3+(2*1.5))-(8/4+(7*2))+(1.25+3.75*(2-0.5))";

// ------------------ Helpers ------------------
function dataHolder(result, remains) {
  this.result = result;
  this.remains = remains;
}

function isOperator(char) {
  return "+-*/()".includes(char);
}

function isNumber(char) {
  return "0123456789.".includes(char);
}

function getCType(char) {
  if (isNumber(char)) return "N";
  if (isOperator(char)) return "O";
  return "X";
}

function resloveNumber(data) {
  let number = "";
  for (let i = 0; i < data.length; i++) {
    const dchar = data[i];
    if (isNumber(dchar)) {
      number += dchar;
    } else {
      break;
    }
  }
  return new dataHolder(number, data.slice(number.length));
}

function resloveOperator(data) {
  // two operators can't be adjacent unless parentheses-related
  const operator = data[0];
  if (isOperator(operator)) return new dataHolder(operator, data.slice(1));
  return new dataHolder(null, data);
}

// ------------------ Lexer ------------------
function tokenize(input) {
  let remains = input;
  const tokens = [];

  while (remains.length > 0) {
    const ctype = getCType(remains[0]);
    if (ctype === "N") {
      const res = resloveNumber(remains);
      tokens.push({ type: "N", value: res.result });
      remains = res.remains;
      continue;
    }

    if (ctype === "O") {
      const res = resloveOperator(remains);
      tokens.push({ type: "O", value: res.result });
      remains = res.remains;
      continue;
    }

    console.error("Unknown character while lexing:", remains[0]);
    break; // stop on unexpected input (preserves original behavior)
  }

  return tokens;
}

// implicit multiplication insertion (e.g., 2(3) => 2*(3))
function insertImplicitMultiplication(tokens) {
  let itr = 0;
  while (itr < tokens.length) {
    const citer = itr;
    itr++;
    const ele = tokens[citer];
    if (citer === 0) continue;

    if (ele.value === "(" && tokens[citer - 1].type === "N") {
      tokens.splice(citer, 0, { type: "O", value: "*" });
      itr++;
    }

    if (ele.type === "N" && tokens[citer - 1].value === ")") {
      tokens.splice(citer, 0, { type: "O", value: "*" });
      itr++;
    }
  }
}

// ------------------ Bracket parser ------------------
function walkBracket(tokens) {
  const innerTokens = [];
  let i = 0;

  while (i < tokens.length) {
    const e = tokens[i];

    if (e.value === "(") {
      const res = walkBracket(tokens.slice(i + 1));
      innerTokens.push(res.innerTokens);
      i += res.length + 1; // skip the inner slice (the slice's length already includes its ')')
      if (i > tokens.length) break;
      continue;
    }

    if (e.value === ")") {
      return { innerTokens, length: i + 1 };
    }

    innerTokens.push(e);
    i++;
  }

  return { innerTokens, length: i };
}

// ------------------ AST generation ------------------
function ASTNode(left, right, Operaton) {
  this.left = left;
  this.right = right;
  this.Operaton = Operaton;
  this.type = "ASTNode";
  this.rightAlign = false;
}

function getValueOfOp(Op) {
  switch (Op) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
  }
  return 0;
}

function Score(listPart) {
  for (let i = 0; i < listPart.length; i++) {
    if (listPart[i].type === "O") {
      const OpVal = getValueOfOp(listPart[i].value);
      if (OpVal == 0) console.error("Invalid Operator in AST Genarator");
      listPart[i].valueLeft = OpVal;
      listPart[i].valueRight = OpVal + 0.1;
    }
  }

  for (let j = 0; j < listPart.length; j++) {
    if (j === 0) {
      if (listPart[j].type === "N") listPart[j].rightAlign = true;
      continue;
    }
    if (j === listPart.length - 1) {
      if (listPart[j].type === "N") listPart[j].rightAlign = false;
      continue;
    }
    if (listPart[j].type === "N") {
      listPart[j].rightAlign = listPart[j - 1].valueRight < listPart[j + 1].valueLeft;
    }
  }

  return listPart;
}

function aligmentRight(list, index) {
  if (index === 0) {
    if (list[index].type === "N" || list[index].type === "ASTNode") {
      list[index].rightAlign = true;
      return true;
    }
  }
  if (index === list.length - 1) {
    if (list[index].type === "N" || list[index].type === "ASTNode") {
      list[index].rightAlign = false;
      return false;
    }
  }
  if (list[index].type === "N" || list[index].type === "ASTNode") {
    list[index].rightAlign = list[index - 1].valueRight < list[index + 1].valueLeft;
    return list[index - 1].valueRight < list[index + 1].valueLeft;
  }
}

function createAST(listPart) {
  listPart = Score(listPart);
  let AstStack = listPart.slice();
  let pass = 0;

  while (AstStack.length > 1) {
    pass++;
    let progress = false;

    for (let k = 0; k < AstStack.length; k++) {
      if (k == 0 || k == AstStack.length - 1) continue;
      if (AstStack[k].type === 'O' && aligmentRight(AstStack, k - 1) == true && aligmentRight(AstStack, k + 1) == false) {
        const newNode = new ASTNode(AstStack[k - 1], AstStack[k + 1], AstStack[k]);
        AstStack.splice(k - 1, 3, newNode);
        progress = true;
        break;
      }
    }

    if (!progress) {
      console.error("AST reduction stalled — no operator could be applied. Current stack:", AstStack);
      break;
    }
  }
  return AstStack[0];
}

function walkNestedArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) arr[i] = walkNestedArray(arr[i]);
    if (i == arr.length - 1) return createAST(arr);
  }
  return arr;
}

// ------------------ Main ------------------
/*const tokens = tokenize(inData);
insertImplicitMultiplication(tokens);

const spaceDevided = walkBracket(tokens);

const AST = walkNestedArray(spaceDevided.innerTokens);
const simplifiedAST = simplifyAST(AST);
console.log("Final AST:");
console.log(AST);
console.log(JSON.stringify(simplifiedAST));

let answer = Calculate(simplifiedAST);
console.log(answer);
*/
function AnswerData(answer,flow) {
  this.answer = answer;
  this.flow = flow;
}
let sol = "";


function CalculateResult(userInput) {
  sol="";
  const tokens = tokenize(userInput);
  insertImplicitMultiplication(tokens);
  const spaceDevided = walkBracket(tokens);
  const AST = walkNestedArray(spaceDevided.innerTokens);
  const simplifiedAST = simplifyAST(AST);
  let answer = Calculate(simplifiedAST);
  const ans = new AnswerData(answer,sol);
  return ans;
}

function SimpeAST(type,value) {
    this.type=type;
    this.value=value;
    
}

function simplifyAST(astData){
    let left = astData?.left;
    let right= astData?.right;
    let tp = astData.type;
    let type = "x";
    let val="";
    if (tp=="N") {
        type="N";
        val = astData.value;
    }
    if (tp=="ASTNode") {
        type="O";
        val = astData.Operaton.value;
    }
    const d =new SimpeAST(type,val);
    if(type==="O"){
        d.left=left;
        d.right=right;
    }
    astData = d;

    if (astData?.left !== undefined) {
        astData.left = simplifyAST(astData.left);
    }
    if (astData?.right!== undefined) {
        astData.right = simplifyAST(astData.right);
    }
    return astData;
}

function Calculate(astData){
    if (astData.type==="N") {
        return parseFloat(astData.value);
    }
    if (astData.left.type==="O") {
        astData.left = new SimpeAST("N",Calculate(astData.left));
    }
    if (astData.right.type==="O") {
        astData.right = new SimpeAST("N",Calculate(astData.right));
    }
    // Testing the seqence.
    let leftVal = astData.left.value;
    let rightVal= astData.right.value;

    switch (astData.value) {
        case "+":
            return Addition(leftVal,rightVal);
        case "-":
            return Minus(leftVal,rightVal);
        case "*":
            return Multiplication(leftVal,rightVal);
        case "/":
            return Divition(leftVal,rightVal);
        default:
            console.error("Unexpected Symbol ",astData.operator.value);
            break;
    }
}

function round4(num) {
    return Math.round(num * 10000) / 10000; // rounds to 4 decimals
}

function Addition(a, b) {
    let ad = round4(parseFloat(a) + parseFloat(b));
    sol += `\n${a} + ${b} = ${ad}`;
    console.log(`${a} + ${b} = ${ad}`);
    return ad;
}

function Minus(a, b) {
    let ad = round4(parseFloat(a) - parseFloat(b));
    sol += `\n${a} - ${b} = ${ad}`;
    console.log(`${a} - ${b} = ${ad}`);
    return ad;
}

function Multiplication(a, b) {
    let ad = round4(parseFloat(a) * parseFloat(b));
    sol += `\n${a} * ${b} = ${ad}`;
    console.log(`${a} * ${b} = ${ad}`);
    return ad;
}

function Divition(a, b) {
    let ad = round4(parseFloat(a) / parseFloat(b));
    sol += `\n${a} / ${b} = ${ad}`;
    console.log(`${a} / ${b} = ${ad}`);
    return ad;
}
