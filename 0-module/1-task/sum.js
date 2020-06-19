function sum(a, b) {
  /* ваш код */
  isTypeNumber(a);
  isTypeNumber(b);
  return a + b;
}

function isTypeNumber(num) {
  if (typeof num !== 'number') {
    throw new TypeError('Not a number!');
  }
}
module.exports = sum;
