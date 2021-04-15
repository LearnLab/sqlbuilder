const SQLBuilder = require("../index");

test('Select statement should always contain a statement and a columns attributes', () => {
    const columns = ['col1', 'col2', 'col3'];
    const query = SQLBuilder.select(...columns);

    expect(query.statement).not.toBeUndefined();
    expect(query.statement).toBe('select');
    expect(query.columns).not.toBeUndefined();
    expect(query.columns).toEqual(columns);
});

test('query.select() => SELECT *', () => {
    const columns = [];
    const query = SQLBuilder.select(...columns);

    expect(query.selectClause()).toEqual('SELECT *');
});

test('query.select([*]) => SELECT *', () => {
    const columns = [['*']];
    const query = SQLBuilder.select(...columns);

    expect(query.selectClause()).toEqual('SELECT *');
});

test('query.select([col1, alias], col2, [col3, alias2]) => SELECT col1 AS alias, col2, col3 AS alias2', () => {
    const columns = [['col1', 'alias'], 'col2', ['col3', 'alias2']];
    const query = SQLBuilder.select(...columns);

    expect(query.selectClause()).toEqual('SELECT col1 AS alias, col2, col3 AS alias2');
});

test('query.select([col1], [col2], [col3]) => SELECT col1, col2, col3', () => {
    const columns = [['col1'], ['col2'], ['col3']];
    const query = SQLBuilder.select(...columns);

    expect(query.selectClause()).toEqual('SELECT col1, col2, col3');
});

/* Some exceptions */
test('query.select().select() => throw Error', () => {
    const columns = [];

    expect(() => SQLBuilder.select(...columns).select(...columns).selectClause()).toThrow(Error);
});

test('query.select(one, [two, *], [three, *]) => throw Error', () => {
    const columns = ['one', ['two', '*'], ['three', '*']];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use * as an alias for a select element'));
});

test('query.select(one, two, *, four, *) => throw Error', () => {
    const columns = ['one', 'two', '*', 'four', '*'];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use * as one of multiple elements'));
});

test('query.select([one], [two], [*], [four], [*]) => throw Error', () => {
    const columns = [['one'], ['two'], ['*'], ['four'], ['*']];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use * as one of multiple elements'));
});

test('query.select([col1, alias1, alias2, alias3, alias4], col2) => throw Error', () => {
    const columns = [['col1', 'alias1', 'alias2', 'alias3', 'alias4'], 'col2'];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not add more than 1 alias to a select element'));
});

test('query.select(one, ) => throw Error', () => {
    const columns = ['one', ''];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use an empty string as a select element'));
});

test('query.select([, alias]) => throw Error', () => {
    const columns = [['', 'alias']];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use an empty string as a select element'));
});

test('query.select([col, ]) => throw Error', () => {
    const columns = [['col', '']];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use an empty string as an alias'));
});

test('query.select([[]], [[[]]]) => throw Error', () => {
    const columns = [[[]], [[[]]]];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use empty or nested arrays as select elements'));
});

test('query.select([], [], [], []) => throw Error', () => {
    const columns = [[], [], [], []];

    expect(() => SQLBuilder.select(...columns).selectClause()).toThrow(Error('You can not use empty or nested arrays as select elements'));
});
