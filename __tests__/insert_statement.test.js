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
  expect(query.columnValues).toEqual(values);
});

/* Without columns */
test('query.insert().into(table).values(val1, val2) => INSERT INTO table VALUES ($1, $2)', () => {
  const table = 'table';
  const values = ['val1', 'val2'];

  const query = SQLBuilder.insert()
    .into(table)
    .values(...values);

  expect(query.insertStatement()).toEqual('INSERT INTO table VALUES ($1, $2);');
  expect(query.columnValues).toEqual(values);
});

/* Multiple rows */
test('query.insert().into(table).values([val1, val2], [val3, val4], [val5, val6]) => INSERT INTO table VALUES ($1, $2), ($3, $4), ($5, $6)', () => {
  const table = 'table';
  const values = [['val1', 'val2'], ['val3', 'val4'], ['val5', 'val6']];

  const query = SQLBuilder.insert()
    .into(table)
    .values(...values);

  expect(query.insertStatement()).toEqual('INSERT INTO table VALUES ($1, $2), ($3, $4), ($5, $6);');
  expect(query.columnValues).toEqual(values);
});

/* Basic errors */
test('query.insert() requires a table reference and a set of values', () => {
  const nothing = SQLBuilder.insert();
  const noTable = SQLBuilder.insert().values('one, two');
  const noValues = SQLBuilder.insert().into('table');

  expect(nothing.insertStatement()).toThrowError(Error('Table reference and scalar values required'));
  expect(noTable.insertStatement()).toThrowError(Error('Table reference and scalar values required'));
  expect(noValues.insertStatement()).toThrowError(Error('Table reference and scalar values required'));
});

test('query.insert() requires the same number of column references as scalar values', () => {
  const moreColumns = SQLBuilder.insert('one', 'two').into('table').values('one');
  const moreValues = SQLBuilder.insert('one', 'two').into('table').values('one');

  expect(moreColumns.values('one')).toThrowError(Error('The set of columns must have the same length as the number of scalar values'));
  expect(moreValues.values('one', 'two', 'three')).toThrowError(Error('The set of columns must have the same length as the number of scalar values'));
});

test('query.insert() prohibits to insert 0 values', () => {
  const emptyValues = SQLBuilder.insert().into('table');
  const emptyValuesArray = SQLBuilder.insert().into('table');

  expect(emptyValues.insert()).toThrowError(Error('You have to insert at least 1 value in all records'));
  expect(emptyValuesArray.insert(['one'], [], [])).toThrowError(Error('You have to insert at least 1 value in all records'));
});

test('query.insert() requires the same number of scalar values between all elements to insert', () => {
  const wrongNumberOne = SQLBuilder.insert().into('table');
  const wrongNumberTwo = SQLBuilder.insert().into('table');

  expect(wrongNumberOne.values(['one'], ['one', 'two']));
  expect(wrongNumberTwo.values(['one', 'two', 'three'], ['one'], ['one', 'two']));
});

test('query.insert() does not allow nested values (arrays between arrays)', () => {
  const nestedOne = SQLBuilder.insert().into('table');

  expect(nestedOne.values(['one'], [['one', 'two'], ['three', 'four']])).toThrowError(Error('You can not insert nested values'));
});
