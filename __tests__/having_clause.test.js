const SQLBuilder = require('../index');

test('query.having(aggr, >=, 35) => ...HAVING aggr>=$1', () => {
  const tables = ['table'];
  const values = [35];
  const query = SQLBuilder.select('*').from(...tables).having('aggr', '>=', values[0]);

  expect(query.havingClause()).toEqual('HAVING aggr>=$1');
  expect(query.values).toEqual(values);
});
