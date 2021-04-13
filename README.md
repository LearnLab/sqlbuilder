# SQLBuilder

This is an interface to create SQL queries without plain text, to make JS backend controllers cleaner and easier to read. I'm strongly inspired to do so after learning about Laravel's Eloquent and QueryBuilder. Hopefully this will make the development process a more enjoyable one.

## Installation

This is a personal project and not a production one, hence I'm not considering the creation of a public npm package. So to install it you'd have to clone the repository and import it from your project.

``` sh
$ git clone https://github.com/LearnLab/sqlbuilder
```

## Usage

In summary, the class produces both a text statement and an array of values (inspired by how node-postgres handles queries), which you can in turn use to query the database. You first start of with a static method to start the statement, which can be select, insert, replace, update, delete or create. For example

``` javascript
const SQLBuilder = require("./sqlbuilder");
const query = SQLBuilder.select('col1', 'col2', 'col3');
```

This returns a SQLBuilder object, for which you can chain methods to add elements to the query, for example you can specify the table from which to pull the data and add conditions

``` javascript
query.from('table')
    .where('col1', '=', 'value');
```

After that you can pull the the statement and the values as follows

``` javascript
const selectStatement = query.selectStatement();
const values = query.values;
```

Everytime you call a selectStatement() method the class will create a new SQL query so you can potentially store that query, change it and have a new one without creating a new SQLBuilder object.

### Select statement

The basic syntax for a select statement is

``` javascript
const query = SQLBuilder.select(<select element list>)
    .from(<table reference>)
    .where(<condition>)
    .groupBy(<group by specification>)
    .having(<condition>)
    .orderBy(<sort specification>)
    .limit(<fetch offset>, <fetch number of rows>);
```

#### Select element list

You can simply specify a given amount of elements to select and you can specify aliases by adding an array of 2 elements instead of a single string, for example `SQLBuilder.select("col1", "col2", ["col3", "alias"]);` which produces `'SELECT col1, col2, col3 AS alias;'`.
