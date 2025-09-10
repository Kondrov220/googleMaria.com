// script.js

let expression = '';
let current = '0';
let lastIsOp = false;

const display = document.getElementById('display');
const exprEl = document.getElementById('expression');
const resEl = document.getElementById('result');

function render() {
  exprEl.textContent = expression || '\u00A0';
  resEl.textContent = current;
}

function inputNumber(n) {
  if(current === '0' || lastIsOp) current = n;
  else current += n;
  lastIsOp = false;
  render();
}

function inputDot() {
  if(lastIsOp) { current = '0.'; lastIsOp = false; render(); return; }
  if(!current.includes('.')) current += '.';
  render();
}

function inputOp(op) {
  if(!expression && !lastIsOp) expression = current + ' ' + op + ' ';
  else if(lastIsOp) expression = expression.slice(0, -3) + ' ' + op + ' ';
  else expression += current + ' ' + op + ' ';
  lastIsOp = true;
  render();
}

function clearAll() { expression=''; current='0'; lastIsOp=false; render(); }
function backspace() { 
  if(lastIsOp){ expression=expression.slice(0,-3); lastIsOp=false; render(); return; }
  if(current.length <= 1) current='0'; else current=current.slice(0,-1); 
  render();
}
function percent() { current=String(parseFloat(current)/100); render(); }

function evaluate() {
  try {
    let expr = (expression + current).replace(/÷/g,'/').replace(/×/g,'*');
    expr = expr.replace(/%/g,'/100');
    const value = new Function('return ('+expr+')')();
    current = String(Number.isInteger(value)?value:+value.toFixed(12)).replace(/\.?0+$/,'');
    expression = '';
    lastIsOp = false;
    render();
  } catch(e){
    current='Error'; expression=''; lastIsOp=false; render();
    setTimeout(()=>{ current='0'; render(); }, 1200);
  }
}

// Підключення кнопок
document.querySelectorAll('[data-num]').forEach(b=> b.addEventListener('click', e=> inputNumber(e.target.dataset.num)));
document.getElementById('dot').addEventListener('click', inputDot);
document.querySelectorAll('[data-op]').forEach(b=> b.addEventListener('click', e=> inputOp(e.target.dataset.op)));
document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('back').addEventListener('click', backspace);
document.getElementById('percent').addEventListener('click', percent);
document.getElementById('equals').addEventListener('click', evaluate);
