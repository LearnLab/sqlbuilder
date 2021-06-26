const SQLBuilder = require('../index');
const {
  REFERENCE_AND_SCALAR_REQUIRED,
  AS_MUCH_COLUMNS_AS_VALUES,
  AT_LEAST_ONE_VALUE,
  NO_SCALARS_AND_ROWS,
  ALL_ROWS_SAME_LENGTH,
  NO_NESTED_VALUES,
} = require('../errors');

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

  expect(() => nothing.insertStatement()).toThrow(REFERENCE_AND_SCALAR_REQUIRED);
  expect(() => noTable.insertStatement()).toThrow(REFERENCE_AND_SCALAR_REQUIRED);
  expect(() => noValues.insertStatement()).toThrow(REFERENCE_AND_SCALAR_REQUIRED);
});

test('query.insert() requires the same number of column references as scalar values', () => {
  const moreColumns = SQLBuilder.insert('one', 'two').into('table');
  const moreValues = SQLBuilder.insert('one', 'two').into('table');

  expect(() => moreColumns.values('one')).toThrow(AS_MUCH_COLUMNS_AS_VALUES);
  expect(() => moreValues.values('one', 'two', 'three')).toThrow(AS_MUCH_COLUMNS_AS_VALUES);
});

test('query.insert() prohibits to insert 0 values', () => {
  const emptyValues = SQLBuilder.insert().into('table');
  const emptyValuesArray = SQLBuilder.insert().into('table');

  expect(() => emptyValues.values()).toThrow(AT_LEAST_ONE_VALUE);
  expect(() => emptyValuesArray.values(['one'], [], [])).toThrow(AT_LEAST_ONE_VALUE);
});

test('query.insert() does not allow scalar values and rows mixed', () => {
  const mixedScalarsRows = SQLBuilder.insert().into('table');

  expect(() => mixedScalarsRows.values('one', ['two', 'three'])).toThrow(NO_SCALARS_AND_ROWS);
});

test('query.insert() requires the same number of scalar values between all elements to insert', () => {
  const wrongNumberOne = SQLBuilder.insert().into('table');
  const wrongNumberTwo = SQLBuilder.insert().into('table');

  expect(() => wrongNumberOne.values(['one'], ['one', 'two'])).toThrow(ALL_ROWS_SAME_LENGTH);
  expect(() => wrongNumberTwo.values(['one', 'two', 'three'], ['one'], ['one', 'two'])).toThrow(ALL_ROWS_SAME_LENGTH);
});

test('query.insert() does not allow nested values (arrays between arrays)', () => {
  const nestedOne = SQLBuilder.insert().into('table');

  expect(() => nestedOne.values(['one'], [['one', 'two'], ['three', 'four']])).toThrow(NO_NESTED_VALUES);
});
