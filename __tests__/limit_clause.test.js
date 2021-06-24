const SQLBuilder = require('../index');

test('query.limit([10, 1]) => ...LIMIT 10 OFFSET 1', () => {
  const query = SQLBuilder.select('*').limit([10, 1]);

  expect(query.limitClause()).toEqual('LIMIT 10 OFFSET 1');
});
