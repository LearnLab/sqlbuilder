const SQLBuilder = require("../index");

test('Select statement should always contain a statement, a columns and a values list', () => {
    const columns = ['col1', 'col2', 'col3'];
    const query = SQLBuilder.select(...columns);

    expect(query.statement).not.toBeUndefined();
    expect(query.statement).toBe('select');
    expect(query.columns).not.toBeUndefined();
    expect(query.columns).toEqual(columns);
    expect(query.values).not.toBeUndefined();
    expect(query.values.length).toBeGreaterThanOrEqual(0);
});

test('SQLBuilder.select(col1, col2, [col3, alias]) => SELECT col1, col2, col3 AS alias;', () => {
    const columns = ['col1', 'col2', ['col3', 'alias']];
    const query = SQLBuilder.select(...columns);

    expect(query.selectStatement()).toEqual('SELECT col1, col2, col3 AS alias;');
});

test('SQLBuilder.select(col1, col2).from(table1, [table2, t]) => SELECT col1, col2 FROM table1, table2 AS t;', () => {
    const columns = ['col1', 'col2'];
    const tables = ['table1', ['table2', 't']];
    const query = SQLBuilder.select(...columns).from(...tables);

    expect(query.selectStatement()).toEqual('SELECT col1, col2 FROM table1, table2 AS t;');
});
