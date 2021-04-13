const SQLBuilder = require("../index");

test('query.where(col1, =, 123).where(col2, >, 54) => ...WHERE col1=$1 AND col2>$2', () => {
    const columns = ['col'];
    const tables = ['table'];
    const values = [123, 54];
    const query = SQLBuilder.select(...columns).from(...tables).where('col1', '=', values[0]).where('col2', '>', values[1]);

    expect(query.whereClause()).toEqual('WHERE col1=$1 AND col2>$2');
    expect(query.values).toEqual(values);
});
