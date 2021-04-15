const SQLBuilder = require("../index");

test('query.from([table1, a], [table2, b], [table3, c]) => ...FROM table1 AS a, table2 AS b, table3 as c', () => {
    const columns = ['col'];
    const tables = [['table1', 'a'], ['table2', 'b'], ['table3', 'c']];
    const query = SQLBuilder.select(...columns).from(...tables);

    expect(query.fromClause()).toEqual('FROM table1 AS a, table2 AS b, table3 AS c');
});

test('query.from(table1, table2, table3) => ...FROM table1, table2, table3', () => {
    const columns = ['col'];
    const tables = ['table1', 'table2', 'table3'];
    const query = SQLBuilder.select(...columns).from(...tables);

    expect(query.fromClause()).toEqual('FROM table1, table2, table3');
});

test('query.from([table1], [table2], [table3]) => ...FROM table1, table2, table3', () => {
    const columns = ['col'];
    const tables = [['table1'], ['table2'], ['table3']];
    const query = SQLBuilder.select(...columns).from(...tables);

    expect(query.fromClause()).toEqual('FROM table1, table2, table3');
});

/* Some exceptions */
test('query.from(...).from(...) => throw Error', () => {
    const query = SQLBuilder.select('*');

    expect(() => query.from('table').from('table').fromClause()).toThrow(Error('You can not call from() function more than once, for more table specifications use from(table1, table2...)'));
});

test('query.from() => throw Error', () => {
    const query = SQLBuilder.select('*');

    expect(() => query.from().fromClause()).toThrow(Error('You can not use an empty string as a table reference'));
});

test('query.from([table, ]) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = [['table', '']]

    expect(() => query.from(...tables).fromClause()).toThrow(Error('You can not use an empty string as a table alias'));
});

test('query.from(table, , table3) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = ['table', '', 'table3'];

    expect(() => query.from(...tables).fromClause()).toThrow(Error('You can not use an empty string as a table reference'));
});

test('query.from([, alias]) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = [['', 'alias']]

    expect(() => query.from(...tables).fromClause()).toThrow(Error('You can not use an empty string as a table reference'));
});

test('query.from([], [], [], [[]]) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = [[], [], [], [[]]];

    expect(() => query.from(...tables).fromClause()).toThrow(Error('You can not use an empty or nested array list as a table reference'));
});

test('query.from([table, alias, alias, alias], [table, alias, alias, alias, alias], [table], [*]) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = [['table', 'alias', 'alias', 'alias'], ['table', 'alias', 'alias', 'alias', 'alias'], ['table'], ['*']];

    expect(() => query.from(...tables).fromClause()).toThrow(Error('You can not specify more than one alias to a table'));
});

test('query.from(*) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = ['*'];

    expect(() => query.from(...tables).fromClause()).toThrow(Error('Invalid table specification'));
});

test('query.from([table, *]) => throw Error', () => {
    const query = SQLBuilder.select('*');
    const tables = [['table', '*']];

    expect(() => query.from(...tables).fromClause()).toThrow(Error('You can not use * as an alias for a table'));
});
