const SQLBuilder = require('../index');

test('query.where(col1, =, 123).where(col2, >, 54) => ...WHERE col1=$1 AND col2>$2', () => {
  const columns = ['col'];
  const tables = ['table'];
  const condition = ['col1', '=', 123];
  const condition2 = ['col2', '>', 54];

  const query = SQLBuilder.select(...columns)
    .from(...tables)
    .where(...condition)
    .where(...condition2);

  expect(query.whereClause()).toEqual('WHERE col1=$1 AND col2>$2');
  expect(query.values).toEqual([condition[2], condition2[2]]);
});

test('query.where(col1, =, 123).orWhere(col2, >, 54) => ...WHERE col1=$1 OR col2>$2', () => {
  const columns = ['col'];
  const tables = ['table'];
  const condition = ['col1', '=', 123];
  const condition2 = ['col2', '>', 54];

  const query = SQLBuilder.select(...columns)
    .from(...tables)
    .where(...condition)
    .orWhere(...condition2);

  expect(query.whereClause()).toEqual('WHERE col1=$1 OR col2>$2');
  expect(query.values).toEqual([condition[2], condition2[2]]);
});

test('query.where(col1, =, 123).orWhere(col2, >, 54).where(col3, <=, 12) => ...WHERE (col1=$1 OR col2>$2) AND col3<=$3', () => {
  const columns = ['col'];
  const tables = ['table'];
  const values = [123, 54, 12];
  const condition = ['col1', '=', values[0]];
  const condition2 = ['col2', '>', values[1]];
  const condition3 = ['col3', '<=', values[2]];

  const query = SQLBuilder.select(...columns)
    .from(...tables)
    .where(...condition)
    .orWhere(...condition2)
    .where(...condition3);

  expect(query.whereClause()).toEqual('WHERE (col1=$1 OR col2>$2) AND col3<=$3');
  expect(query.values).toEqual(values);
});
