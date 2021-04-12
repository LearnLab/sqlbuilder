const SQLBuilder = require("../index");

test('Select static method starts a select statement', () => {
    const query = SQLBuilder.select("*");

    expect(query.statement).toBe('select');
});

test('Select statement should always contain a columns and a values list', () => {
    const columns = ["col1", "col2", "col3"];
    const query = SQLBuilder.select(...columns);

    expect(query.columns).not.toBe(undefined);
    expect(query.columns).toEqual(columns);
    expect(query.values).not.toBe(undefined);
    expect(query.values.length).toBeGreaterThanOrEqual(0);
});
