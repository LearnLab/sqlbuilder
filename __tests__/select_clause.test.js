const SQLBuilder = require("../index");

test('Select statement should always contain a statement and a columns attributes', () => {
    const columns = ['col1', 'col2', 'col3'];
    const query = SQLBuilder.select(...columns);

    expect(query.statement).not.toBeUndefined();
    expect(query.statement).toBe('select');
    expect(query.columns).not.toBeUndefined();
    expect(query.columns).toEqual(columns);
});

test('query.select([col1, alias], col2, [col3, alias2]) => SELECT col1 AS alias, col2, col3 AS alias2', () => {
    const columns = [['col1', 'alias'], 'col2', ['col3', 'alias2']];
    const query = SQLBuilder.select(...columns);

    expect(query.selectClause()).toEqual('SELECT col1 AS alias, col2, col3 AS alias2');
});
