# SQLBuilder
[![Build Status](https://travis-ci.com/LearnLab/sqlbuilder.svg?branch=main)](https://travis-ci.com/LearnLab/sqlbuilder)

This is an interface to create SQL queries without plain text, to make JS backend controllers cleaner and easier to read. I'm strongly inspired to do so after learning about Laravel's Eloquent and QueryBuilder. Hopefully this will make the development process a more enjoyable one.

## Installation

This is a personal project and not a production one, hence I'm not considering the creation of a public npm package. So to install it you'd have to clone the repository and import it from your project.

``` sh
$ git clone https://github.com/LearnLab/sqlbuilder
```

## Usage

In summary, the class produces both a text statement and an array of values (inspired by how node-postgres handles queries), which you can in turn use to query the database. You first start of with a static method to start the statement, which can be either select, insert, replace, update, delete or create. For example

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
const values = query.columnValues;
```

Everytime you call a selectStatement() method the class will create a new SQL query so you can potentially store that query, change it and have a new one without creating a new SQLBuilder object.

### Select statement

The basic syntax for a select statement is

``` javascript
const query = SQLBuilder.select('one', 'two', 'three')
    .from('table')
    .where('two', '=', 2)
    .orWhere('three', '>', 1)
    .groupBy('one')
    .having('count(*)', '>', 1)
    .orderBy('two')
    .limit(3, 1);
```

### Insert statement

The basic syntax for an insert statement is

``` javascript
const query = SQLBuilder.insert('col1', 'col2')
    .into('table')
    .values(['val1', 'val2'], ['val3', 'val4']);
```

you can then invoke the `insertStatement()` method to get the insert query with the replaced parameters

``` javascript
query.insertStatement() //=> 'INSERT INTO table (col1, col2) VALUES ($1, $2), ($3, $4);'
```

