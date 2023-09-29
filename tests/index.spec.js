function numPlus(a, b) {
  return a + b;
}

it('test num plus', () => {
  expect(numPlus(2, 3)).to.equal(5);
});
