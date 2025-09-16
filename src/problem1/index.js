// Problem 1: Three ways to sum to n
const sum_to_n_a = function (n) {
  // your code here
  // loop through 0 to n - 1

  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i + 1;
  }

  return sum;
};

const sum_to_n_b = function (n) {
  // your code here
  // use math expression n * (n + 1) / 2
  return (n * (n + 1)) / 2;
};

const sum_to_n_c = function (n) {
  // your code here
  // use recursion

  if (n <= 1) return n;

  return n + sum_to_n_c(n - 1);
};
