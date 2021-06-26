/**
 * SQLBuilder class
 *
 * The goal of this class is to create an interface similar to that of
 * Laravel's Eloquent to create SQL statements without writing it
 * directly. Hopefully this will make controller code a lot more
 * readable.
 */
class SQLBuilder {
  /* Only initialize attributes used for every method */
  constructor() {
    this.statement = null;
  }

  /**
   * Based on a given array of elements [[elem1, alias1], [elem2, alias2]..., [elemN, aliasN]]
   * get the resulting 'elem1 AS alas1, elem2 AS alias2, ... , elemN AS aliasN'
   */
  static getList(elements) {
    let elementsList = '';

    for (let i = 0; i < elements.length; i += 1) {
      let col = elements[i];

      if (col instanceof Array) {
        if (col.length === 2) {
          const [name, alias] = col;
          col = `${name} AS ${alias}`;
        } else {
          [col] = col;
        }
      }

      elementsList += (i > 0) ? `, ${col}` : col;
    }

    return elementsList;
  }

  /**
   * Based on a given array of elements [[elem1, dir1], [elem2, dir2]..., [elemN, dirN]]
   * get the resulting 'elem1 DIR1, elem2 DIR2, ... , elemN DIRN'
   */
  static getSorts(elements) {
    let sorts = '';

    for (let i = 0; i < elements.length; i += 1) {
      let col = elements[i];

      if (col instanceof Array) {
        const [name, dir] = col;
        col = `${name} ${dir.toUpperCase()}`;
      }

      sorts += (i > 0) ? `, ${col}` : col;
    }

    return sorts;
  }

  /**
   * <select statement> ::=
   *      <table expression>
   *
   * <table expression> ::=
   *      <select block head> [ <select block tail> ]
   *
   * <select block head> ::=
   *      <select clause>
   *      [ <from clause>
   *      [ <where clause> ]
   *      [ <group by clause> ]
   *      [ <having clause> ] ]
   *
   * <select block tail> ::=
   *      <order by clause> |
   *      <limit clause> |
   *      <order by clause> <limit clause>
   */

  /**
   * <select clause> ::=
   *      SELECT <select option>... <select element list>
   */
  static select(...columns) {
    /* First validate */
    columns.forEach((col, _, arr) => {
      if (col === '*' && arr.length > 1) throw new Error('You can not use * as one of multiple elements');

      if (col instanceof Array) {
        if (col.length > 2) throw new Error('You can not add more than 1 alias to a select element');

        if (col.length === 2) {
          const [a, b] = col;

          if (a instanceof Array || b instanceof Array) throw new Error('You can not use empty or nested arrays as select elements');

          if (a === '*' && arr.length > 1) throw new Error('You can not use * as one of multiple elements');

          if (b === '*') throw new Error('You can not use * as an alias for a select element');

          if (!a) throw new Error('You can not use an empty string as a select element');

          if (!b) throw new Error('You can not use an empty string as an alias');
        }

        if (col.length === 1) {
          const [a] = col;

          if (a instanceof Array) throw new Error('You can not use empty or nested arrays as select elements');

          if (a === '*' && arr.length > 1) throw new Error('You can not use * as one of multiple elements');

          if (!a) throw new Error('You can not use an empty string as a select element');
        }

        if (col.length === 0) throw new Error('You can not use empty or nested arrays as select elements');
      }

      if (!col) throw new Error('You can not use an empty string as a select element');
    });

    const query = new SQLBuilder();

    /* Initialize everything needed for select statements */
    query.statement = 'select';
    query.columns = (columns.length !== 0) ? columns : ['*'];
    query.columnValues = [];

    return query;
  }

  /**
   * Select clause
   */
  selectClause() {
    return `SELECT ${SQLBuilder.getList(this.columns)}`;
  }

  /**
   * Select statement string
   */
  selectStatement() {
    /* Reset prepared values */
    this.columnValues = [];

    /* Add select clause */
    let query = this.selectClause();

    /* Add from clause */
    const from = this.fromClause();
    if (from) query += ` ${from}`;

    /* Add where clause */
    const where = this.whereClause();
    if (where) query += ` ${where}`;

    /* Finish */
    query += ';';

    return query;
  }

  /**
   * <from clause> ::=
   *      FROM <table reference> [ , <table reference> ]...
   *
   * <table reference> ::=
   *      <table specification> [ [ AS ] <pseudonym> ]
   *
   * <table specification> ::=
   *      [ <database name> . ] <table name>
   *
   * <pseudonym> ::=
   *      <name>
   */
  from(...tables) {
    if (this.tables) throw new Error('You can not call from() function more than once, for more table specifications use from(table1, table2...)');

    tables.forEach((table) => {
      if (table === '*') throw new Error('Invalid table specification');

      if (table instanceof Array) {
        if (table.length > 2) throw new Error('You can not specify more than one alias to a table');

        if (table.length === 2) {
          const [a, b] = table;

          if (a instanceof Array || b instanceof Array) throw new Error('You can not use empty or nested arrays as select elements');

          if (!a) throw new Error('You can not use an empty string as a table reference');

          if (!b) throw new Error('You can not use an empty string as a table alias');

          if (a === '*') throw new Error('Invalid table specification');

          if (b === '*') throw new Error('You can not use * as an alias for a table');
        }

        if (table.length === 1) {
          const [a] = table;

          if (!a) throw new Error('You can not use an empty string as a table reference');

          if (a instanceof Array) throw new Error('You can not use empty or nested array list as a table references');

          if (a === '*') throw new Error('You can not use * as an alias for a table');
        }

        if (table.length === 0) throw new Error('You can not use an empty or nested array list as a table reference');
      }

      if (!table) throw new Error('You can not use an empty string as a table reference');
    });

    if (tables.length === 0) throw new Error('You can not use an empty string as a table reference');

    this.tables = tables;

    return this;
  }

  /**
   * From clause
   */
  fromClause() {
    if (!this.tables || this.tables.length === 0) return null;

    return `FROM ${SQLBuilder.getList(this.tables)}`;
  }

  /**
   * <where clause> ::=
   *      WHERE <condition>
   *
   * <condition> ::=
   *      <predicate>                 |
   *      <predicate> OR <predicate>  |
   *      <predicate> AND <predicate> |
   *      ( <condition> )             |
   *      NOT <condition>
   *
   * <predicate> ::=
   *      <predicate with comparison>     |
   *      <predicate without comparison>  |
   *      <predicate with in>             |
   *      <predicate with between>        |
   *      <predicate with like>           |
   *      <predicate with regexp>         |
   *      <predicate with match>          |
   *      <predicate with null>           |
   *      <predicate with exists>         |
   *      <predicate with any all>
   */
  where(column, operator, value) {
  /* Star off by checking */
    if (!this.predicates) this.predicates = [];

    if (!this.conditionals) this.conditionals = [];

    if (this.predicates.length > 0) this.conditionals.push('AND');

    this.predicates.push([column, operator, value]);

    return this;
  }

  orWhere(column, operator, value) {
    /* Star off by checking */
    this.conditionals.push('OR');

    this.predicates.push([column, operator, value]);

    return this;
  }

  /* Get where clause */
  whereClause() {
    if (!this.predicates || this.predicates.length === 0 || !this.conditionals) return null;

    const max = this.predicates.length;
    let predicates = '';

    for (let i = 0; i < max; i += 1) {
      const [column, operator, value] = this.predicates[i];

      this.columnValues.push(value);

      let predicate = `${column}${operator}$${this.columnValues.length}`;

      if (max >= 3 && (i + 1) < max && i % 2 === 0) predicate = `(${predicate}`;

      if (max >= 3 && (i + 1) <= max && i % 2 !== 0) predicate = `${predicate})`;

      predicates = (i > 0) ? `${predicates} ${this.conditionals[i - 1]} ${predicate}` : `${predicate}`;
    }

    return `WHERE ${predicates}`;
  }

  /**
   * <group by clause> ::=
   *      GROUP BY <group by specification list> [ WITH ROLLUP ]
   *
   * <group by specification list> ::=
   *      <group by specification> [ , <group by specification> ]...
   *
   * <group by specification> ::=
   *      <group by expression> [ <sort direction> ]
   *
   * <group by expression> ::= <scalar expression>
   *
   * <sort direction> ::= ASC | DESC
   */
  groupBy(...groups) {
    this.groups = groups;

    return this;
  }

  /**
   * Group by clause
   */
  groupByClause() {
    if (!this.groups || this.groups.length === 0) return null;

    return `GROUP BY ${SQLBuilder.getSorts(this.groups)}`;
  }

  /**
   * <having clause> ::=
   *      HAVING <condition>
   */
  having(aggr, conditional, value) {
    this.havings = [aggr, conditional, value];

    return this;
  }

  /**
   * Having clause
   */
  havingClause() {
    if (!this.havings || this.havings.length === 0) return null;

    const [aggr, conditional, value] = this.havings;

    this.columnValues.push(value);

    return `HAVING ${aggr}${conditional}$${this.columnValues.length}`;
  }

  /**
   * <order by clause> ::=
   *      ORDER BY <sort specification> [ , <sort specification> ]...
   *
   * <sort specification> ::=
   *      <column name> [ <sort direction> ]          |
   *      <scalar expression> [ <sort direction> ]    |
   *      <sequence number> [ <sort direction> ]
   *
   * <sort direction> ::= ASC | DESC
   */
  orderBy(...orders) {
    this.orders = orders;

    return this;
  }

  /**
   * Order by clause
   */
  orderByClause() {
    if (!this.orders || this.orders.length === 0) return null;

    return `ORDER BY ${SQLBuilder.getSorts(this.orders)}`;
  }

  /**
   * <limit clause> ::=
   *      LIMIT [ <fetch offset> , ] <fetch number of rows        |
   *      LIMIT <fetch number of rows> [ OFFSET <fetch offset> ]
   *
   * <fetch number of rows>   ;
   * <fetch offset>           ::= <whole number>
   */
  limit(fetch) {
    this.fetch = fetch;

    return this;
  }

  /**
   * Limit clause
   */
  limitClause() {
    if (!this.fetch) return null;

    if (this.fetch instanceof Array) {
      const [fetch, offset] = this.fetch;
      return `LIMIT ${fetch} OFFSET ${offset}`;
    }

    return `LIMIT ${this.fetch}`;
  }

  /**
   * Start an insert operation, for which you need to specify
   * optionaly a list of columns, the table into which to
   * insert and the values
   *
   * @param {Array} columns
   * @return {SQLBuilder} query
   */
  static insert(...columns) {
    const query = new SQLBuilder();

    /* Declare initials */
    query.statement = 'insert';
    query.columns = (columns.length > 0) ? columns : [];
    query.columnValues = [];

    return query;
  }

  /**
   * Indicate the table in which to insert the new data,
   * this must be a table specification
   *
   * @param {string} table
   * @return {SQLBuilder} this
   */
  into(table) {
    this.table = table;

    return this;
  }

  /**
   * Indicate the values to insert. These can be either to
   * insert one or multiple rows
   *
   * @param {Array} columnValues
   * @return {SQLBuilder} this
   */
  values(...columnValues) {
    this.columnValues = columnValues;

    return this;
  }

  /**
   * Returns the scalar row expression with
   * possibly multiple rows to add
   *
   * @return {string} valuesClause
   */
  valuesClause() {
    const preparedValue = (_, i, arr, add = 0) => {
      let crtValue = `$${i + 1 + add}`;

      if (i === 0) crtValue = `(${crtValue}`;
      if (i + 1 === arr.length) crtValue = `${crtValue})`;

      return crtValue;
    };

    const rowExpressions = this.columnValues.map((scalar, i, arr) => {
      if (scalar instanceof Array) {
        return scalar.map((_, b, inner) => preparedValue(_, b, inner, i * inner.length))
          .join(', ');
      }

      return preparedValue(scalar, i, arr);
    });

    return rowExpressions.join(', ');
  }

  /**
   * Returns the insert statement for the current insert
   * operation
   *
   * @return {string} insertStatement
   */
  insertStatement() {
    let statement = 'INSERT';

    statement += ` INTO ${this.table}`;

    if (this.columns.length > 0) statement += ` (${this.columns.join(', ')})`;

    statement += ' VALUES';

    statement += ` ${this.valuesClause()}`;

    statement += ';';

    return statement;
  }
}

module.exports = SQLBuilder;
