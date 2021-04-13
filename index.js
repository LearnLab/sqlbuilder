/**
 *
 * SQLBuilder class
 *
 * The goal of this class is to create an interface similar to that of
 * Laravel's Eloquent to create SQL statements without writing it
 * directly. Hopefully this will make controller code a lot more
 * readable.
 */
class SQLBuilder {
    /* Only initialize attributes used for every method */
    constructor() {
        this.statement = null;
    }

    /**
     * Gets a string of 'element1, element2, element3 AS alias' from an array
     * of elements
     */
    static getList(elements) {
        let elementsList = '';

        for(let i = 0; i < elements.length; i++) {
            let col = elements[i];

            if(col instanceof Array) {
                const [name, alias] = col;
                col = `${name} AS ${alias}`;
            }

            elementsList += (i > 0) ? `, ${col}` : col;
        }

        return elementsList;
    }

    /**
     * <select statement> ::=
     *      <table expression>
     *
     * <table expression> ::=
     *      <select block head> [ <select block tail> ]
     *
     * <select block head> ::=
     *      <select clause>
     *      [ <from clause>
     *      [ <where clause> ]
     *      [ <group by clause> ]
     *      [ <having clause> ] ]
     *
     * <select block tail> ::=
     *      <order by clause> |
     *      <limit clause> |
     *      <order by clause> <limit clause>
     */

    /**
     * <select clause> ::=
     *      SELECT <select option>... <select element list>
     */
    static select(...columns) {
        let query = new SQLBuilder();

        /* Initialize everything needed for select statements */
        query.statement = 'select';
        query.columns = ["*"];
        query.values = [];

        /* For where clause */
        query.predicates = [];
        query.conditionals = [];

        if(columns.length !== 0)
            query.columns = columns;

        return query;
    }

    /**
     * Select clause
     */
    selectClause() {
        return `SELECT ${SQLBuilder.getList(this.columns)}`;
    }

    /**
     * Select statement string
     */
    selectStatement() {
        /* Reset prepared values */
        this.values = [];

        /* Add select clause */
        let query = this.selectClause();

        /* Add from clause */
        query += ` ${this.fromClause()}`;

        /* Add where clause */
        const where = this.whereClause();
        if(where)
            query += ` ${where}`;

        /* Finish */
        query += ';';

        return query;
    }


    /**
     * <from clause> ::=
     *      FROM <table reference> [ , <table reference> ]...
     *
     * <table reference> ::=
     *      <table specification> [ [ AS ] <pseudonym> ]
     *
     * <table specification> ::=
     *      [ <database name> . ] <table name>
     *
     * <pseudonym> ::=
     *      <name>
     */
    from(...tables) {
        this.tables = tables;

        return this;
    }

    /**
     * From clause
     */
    fromClause() {
        return `FROM ${SQLBuilder.getList(this.tables)}`;
    }

    /**
     * <where clause> ::=
     *      WHERE <condition>
     *
     * <condition> ::=
     *      <predicate>                 |
     *      <predicate> OR <predicate>  |
     *      <predicate> AND <predicate> |
     *      ( <condition> )             |
     *      NOT <condition>
     *
     * <predicate> ::=
     *      <predicate with comparison>     |
     *      <predicate without comparison>  |
     *      <predicate with in>             |
     *      <predicate with between>        |
     *      <predicate with like>           |
     *      <predicate with regexp>         |
     *      <predicate with match>          |
     *      <predicate with null>           |
     *      <predicate with exists>         |
     *      <predicate with any all>
     */
    where(column, operator, value) {
        if(this.predicates.length > 0)
            this.conditionals.push('AND');

        this.predicates.push([column, operator, value]);

        return this;
    }

    /* Get where clause */
    whereClause() {
        if(this.predicates.length === 0)
            return '';

        const max = this.predicates.length;
        let predicates = '';

        for(let i = 0; i < max; i++) {
            const [column, operator, value] = this.predicates[i];

            this.values.push(value);

            let predicate = `${column}${operator}$${this.values.length}`;

            if(3 <= max && (i + 1) < max && i % 2 === 0)
                predicate = `(${predicate}`;

            if(3 <= max && (i + 1) <= max && i % 2 !== 0)
                predicate = `${predicate})`;

            predicates = (i > 0) ? `${predicates} ${this.conditionals[i - 1]} ${predicate}` : `${predicate}`;
        }

        return `WHERE ${predicates}`;
    }
}

module.exports = SQLBuilder;
