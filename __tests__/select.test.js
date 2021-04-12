const SQLBuilder = require("../index");

test('Select static method starts a select statement', () => {
    const query = SQLBuilder.select("*");

    expect(query.statement).toBe('select');
});
