const SQLBuilder = require('../index');

test('query.groupBy(town) => ...GROUP BY town', () => {
  const tables = ['table'];
  const query = SQLBuilder.select('*').from(...tables).groupBy('town');

  expect(query.groupByClause()).toEqual('GROUP BY town');
});

test('query.groupBy([town, desc], city, street, [name, asc]) => ...GROUP BY town DESC, city, street, name ASC', () => {
  const groups = [['town', 'desc'], 'city', 'street', ['name', 'asc']];
  const query = SQLBuilder.select('*').groupBy(...groups);

  expect(query.groupByClause()).toEqual('GROUP BY town DESC, city, street, name ASC');
});
