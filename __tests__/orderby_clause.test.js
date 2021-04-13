const SQLBuilder = require("../index");

test('query.orderBy(col) => ...ORDER BY col', () => {
    const query = SQLBuilder.select('*').orderBy('col');

    expect(query.orderByClause()).toEqual('ORDER BY col');
});

test('query.orderBy(col, desc).orderBy(col2, asc).orderBy(col3) => ...ORDER BY col DESC, col2 ASC, col3', () => {
    const query = SQLBuilder.select('*').orderBy('col', 'desc').orderBy('col2', 'asc').orderBy('col3');

    expect(query.orderByClause()).toEqual('ORDER BY col DESC, col2 ASC, col3');
});
