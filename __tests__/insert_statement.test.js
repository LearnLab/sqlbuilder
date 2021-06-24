const SQLBuilder = require('../index');

/* Basic usage */
test('query.insert(col1, col2).into(table).values(val1, val2) => INSERT INTO table (col1, col2) VALUES ($1, $2)', () => {
  const columns = ['col1', 'col2'];
  const table = 'table';
  const values = ['val1', 'val2'];

  const query = SQLBuilder.insert(...columns)
    .into(table)
    .values(...values);

  expect(query.insertStatement()).toEqual('INSERT INTO table (col1, col2) VALUES ($1, $2);');
  expect(query.values).toEqual(values);
});

/* Without columns */
test('query.insert().into(table).values(val1, val2) => INSERT INTO table VALUES ($1, $2)', () => {
  const table = 'table';
  const values = ['val1', 'val2'];

  const query = SQLBuilder.insert()
    .into(table)
    .values(...values);

  expect(query.insertStatement()).toEqual('INSERT INTO table VALUES ($1, $2);');
  expect(query.values).toEqual(values);
});

/* Multiple rows */
test('query.insert().into(table).values([val1, val2], [val3, val4], [val5, val6]) => INSERT INTO table VALUES ($1, $2), ($3, $4), ($5, $6)', () => {
  const table = 'table';
  const values = [['val1', 'val2'], ['val3', 'val4'], ['val5', 'val6']];

  const query = SQLBuilder.insert()
    .into(table)
    .values(...values);

  expect(query.insertStatement()).toEqual('INSERT INTO table VALUES ($1, $2), ($3, $4), ($5, $6);');
  expect(query.values).toEqual(values);
});
