const Errors = {
  /* Insert Errors */
  REFERENCE_AND_SCALAR_REQUIRED: Error('Table reference and scalar values are required'),
  AS_MUCH_COLUMNS_AS_VALUES: Error('The set of columns must have the same length as the number of scalar values'),
  AT_LEAST_ONE_VALUE: Error('You have to insert at least 1 value in all records'),
  NO_SCALARS_AND_ROWS: Error('You can not mix scalars and rows within the values() arguments'),
  ALL_ROWS_SAME_LENGTH: Error('All scalar sets must have the same number of elements'),
  NO_NESTED_VALUES: Error('You can not insert nested values'),
};

module.exports = Errors;
