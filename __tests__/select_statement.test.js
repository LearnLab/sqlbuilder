const SQLBuilder = require('../index');

test('query.select().from(users).where(email, =, my_email) => SELECT * FROM users WHERE email=$1', () => {
  const columns = [];
  const tables = ['users'];
  const values = ['my_email'];
  const condition = ['email', '=', values[0]];

  const query = SQLBuilder.select(...columns)
    .from(...tables)
    .where(...condition);

  expect(query.selectStatement()).toEqual('SELECT * FROM users WHERE email=$1;');
  expect(query.values).toEqual(values);
});
