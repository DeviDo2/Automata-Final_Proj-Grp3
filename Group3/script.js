// ── NAVIGATION ──────────────────────────
const screens = ['home', 'division', 'euclidean', 'collatz', 'palindrome', 'recursive'];

function goTo(id) {
  screens.forEach(s => {
    const el = document.getElementById('screen-' + s);
    el.classList.toggle('active', s === id);
  });
  window.scrollTo(0, 0);
}

// ── HELPERS ─────────────────────────────
function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  el.className = 'alert ' + type;
  el.textContent = msg;
}

function clearAlert(id) {
  const el = document.getElementById(id);
  el.className = 'alert';
  el.textContent = '';
}

function setResult(id, text, empty) {
  const el = document.getElementById(id);
  el.innerHTML = text.replace(/\n/g, '<br>');
  el.className = empty ? 'result-box empty' : 'result-box';
}

function formatNumber(num) {
  return num.toLocaleString();
}

// ── DIVISION ALGORITHM ──────────────────
function computeDivision() {
  clearAlert('div-alert');
  const a = parseInt(document.getElementById('div-a').value);
  const b = parseInt(document.getElementById('div-b').value);

  if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
    showAlert('div-alert', 'Please enter two positive integers.', 'error');
    setResult('div-result', 'Enter two positive integers and click Compute.', true);
    return;
  }

  const dividend  = Math.max(a, b);
  const divisor   = Math.min(a, b);
  const quotient  = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const out =
    `SOLUTION\n` +
    `─────────────────────────────\n` +
    `${formatNumber(dividend)} = ${formatNumber(divisor)}(${formatNumber(quotient)}) + ${formatNumber(remainder)}\n\n` +
    `Dividend  : ${formatNumber(dividend)}\n` +
    `Divisor   : ${formatNumber(divisor)}\n` +
    `Quotient  : ${formatNumber(quotient)}\n` +
    `Remainder : ${formatNumber(remainder)}`;

  setResult('div-result', out, false);
}

// ── EUCLIDEAN ALGORITHM ─────────────────
function computeEuclidean() {
  clearAlert('euc-alert');
  const n1 = parseInt(document.getElementById('euc-a').value);
  const n2 = parseInt(document.getElementById('euc-b').value);

  if (isNaN(n1) || isNaN(n2) || n1 <= 0 || n2 <= 0) {
    showAlert('euc-alert', 'Please enter two positive integers.', 'error');
    setResult('euc-result', 'Enter two positive integers and click Compute.', true);
    return;
  }

  const original1 = n1, original2 = n2;
  let a = Math.max(n1, n2);
  let b = Math.min(n1, n2);
  const larger = a, smaller = b;
  const steps = [];

  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    steps.push(r === 0 ? `${formatNumber(a)} = ${formatNumber(b)}(${formatNumber(q)})` : `${formatNumber(a)} = ${formatNumber(b)}(${formatNumber(q)}) + ${formatNumber(r)}`);
    a = b;
    b = r;
  }

  const gcd = a;
  const lcm = (original1 * original2) / gcd;

  const out =
    `SOLUTION\n` +
    `─────────────────────────────\n` +
    steps.join('\n') + '\n\n' +
    `The integers are ${formatNumber(larger)} and ${formatNumber(smaller)}\n` +
    `GCD(${formatNumber(larger)}, ${formatNumber(smaller)}) = ${formatNumber(gcd)}\n` +
    `LCM(${formatNumber(larger)}, ${formatNumber(smaller)}) = ${formatNumber(lcm)}`;

  setResult('euc-result', out, false);
}

// ── COLLATZ SEQUENCE ────────────────────
function computeCollatz() {
  clearAlert('col-alert');
  const raw = document.getElementById('col-n').value.trim();
  const n = parseInt(raw);

  if (!raw || isNaN(n) || n <= 0 || n % 2 === 0) {
    showAlert('col-alert', 'Please enter a positive odd integer.', 'error');
    setResult('col-result', 'Enter a positive odd integer and click Compute.', true);
    return;
  }

  const seq = [];
  let cur = n;
  seq.push(cur);
  while (cur !== 1) {
    cur = cur % 2 === 0 ? cur / 2 : 3 * cur + 1;
    seq.push(cur);
  }

  const out =
    `The Collatz sequence starting at ${n}:\n\n` +
    seq.join(', ') +
    `\n\nTotal terms: ${seq.length}`;

  setResult('col-result', out, false);
}

function clearCollatz() {
  document.getElementById('col-n').value = '';
  clearAlert('col-alert');
  setResult('col-result', 'Enter a positive odd integer and click Compute.', true);
}

// ── PALINDROME CHECKER ──────────────────
function computePalindrome() {
  const raw = document.getElementById('pal-input').value;
  const len = raw.length;

  const stripped = raw.replace(/ /g, '').toUpperCase();
  let left = 0, right = stripped.length - 1;
  let isPalin = true;
  while (left < right) {
    if (stripped[left] !== stripped[right]) { isPalin = false; break; }
    left++;
    right--;
  }

  document.getElementById('pal-display').textContent = '"' + raw + '"';
  document.getElementById('pal-length').textContent = len + ' character' + (len !== 1 ? 's' : '');

  const verdict = document.getElementById('pal-verdict');
  verdict.innerHTML = isPalin
    ? '<span class="g3-badge yes">Yes</span>'
    : '<span class="g3-badge no">No</span>';

  document.getElementById('pal-result-area').style.display = 'block';
}

function clearPalindrome() {
  document.getElementById('pal-input').value = '';
  document.getElementById('pal-result-area').style.display = 'none';
}

// ── RECURSIVE SEQUENCES ─────────────────
let currentTab = 'fib';

function switchTab(tab) {
  currentTab = tab;
  ['fib', 'lucas', 'trib'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
    document.getElementById('info-' + t).style.display = t === tab ? 'block' : 'none';
  });
  clearAlert('rec-alert');
  setResult('rec-result', 'Choose a sequence type and enter the number of terms.', true);
  document.getElementById('rec-n').value = '';
}

function computeRecursive() {
  clearAlert('rec-alert');
  const n = parseInt(document.getElementById('rec-n').value);

  const minMap  = { fib: 3, lucas: 3, trib: 4 };
  const nameMap = { fib: 'Fibonacci', lucas: 'Lucas', trib: 'Tribonacci' };
  const min = minMap[currentTab];

  if (isNaN(n) || n < min) {
    showAlert('rec-alert', `Please enter an integer greater than ${min - 1}.`, 'error');
    setResult('rec-result', 'Choose a sequence type and enter the number of terms.', true);
    return;
  }

  const seq = new Array(n).fill(0n);

  if (currentTab === 'fib') {
    seq[0] = 0n; seq[1] = 1n;
    for (let i = 2; i < n; i++) seq[i] = seq[i - 1] + seq[i - 2];
  } else if (currentTab === 'lucas') {
    seq[0] = 2n; seq[1] = 1n;
    for (let i = 2; i < n; i++) seq[i] = seq[i - 1] + seq[i - 2];
  } else {
    seq[0] = 0n; seq[1] = 0n; seq[2] = 1n;
    for (let i = 3; i < n; i++) seq[i] = seq[i - 1] + seq[i - 2] + seq[i - 3];
  }

  const out =
    `The ${nameMap[currentTab]} numbers (${n} terms):\n\n` +
    seq.join(', ');

  setResult('rec-result', out, false);
}

// ── EVENT LISTENERS ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') computePalindrome();
  });
});
