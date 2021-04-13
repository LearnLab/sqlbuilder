const SQLBuilder = require("../index");

test('query.from([table1, a], [table2, t]) => ...FROM table1 AS a, table2 AS t', () => {
    const columns = ['col'];
    const tables = [['table1', 'a'], ['table2', 't']];
    const query = SQLBuilder.select(...columns).from(...tables);

    expect(query.fromClause()).toEqual('FROM table1 AS a, table2 AS t');
});
