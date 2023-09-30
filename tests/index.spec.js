function numPlus(a, b) {
  return a + b;
}

// arrow-callback doesn't support Android 5.0
it('test num plus', function () {
  expect(numPlus(2, 3)).to.equal(5);
});
