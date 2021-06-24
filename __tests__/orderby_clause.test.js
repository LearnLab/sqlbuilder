const SQLBuilder = require('../index');

test('query.orderBy(col) => ...ORDER BY col', () => {
  const query = SQLBuilder.select('*').orderBy('col');

  expect(query.orderByClause()).toEqual('ORDER BY col');
});

test('query.orderBy([col1, desc], col2, [col3, asc], [col4, desc], col5) => ...ORDER BY col1 DESC, col2, col3 ASC, col4 DESC, col5', () => {
  const orders = [['col1', 'desc'], 'col2', ['col3', 'asc'], ['col4', 'desc'], 'col5'];
  const query = SQLBuilder.select('*').orderBy(...orders);

  expect(query.orderByClause()).toEqual('ORDER BY col1 DESC, col2, col3 ASC, col4 DESC, col5');
});
