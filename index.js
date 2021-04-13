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
     * Based on a given array of elements [[elem1, alias1], [elem2, alias2]..., [elemN, aliasN]]
     * get the resulting 'elem1 AS alas1, elem2 AS alias2, ... , elemN AS aliasN'
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
     * Based on a given array of elements [[elem1, dir1], [elem2, dir2]..., [elemN, dirN]]
     * get the resulting 'elem1 AS DIR1, elem2 AS DIR2, ... , elemN AS DIRN'
     */
    static getSorts(elements) {
        let sorts = '';

        for(let i = 0; i < elements.length; i++) {
            let col = elements[i];

            if(col instanceof Array) {
                const [name, dir] = col;
                col = `${name} ${dir.toUpperCase()}`;
            }

            sorts += (i > 0) ? `, ${col}` : col;
        }

        return sorts;
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

        /* For group by clause */
        query.groups = [];

        /* For havings clause */
        query.havings = [];

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

    /**
     * <group by clause> ::=
     *      GROUP BY <group by specification list> [ WITH ROLLUP ]
     *
     * <group by specification list> ::=
     *      <group by specification> [ , <group by specification> ]...
     *
     * <group by specification> ::=
     *      <group by expression> [ <sort direction> ]
     *
     * <group by expression> ::= <scalar expression>
     *
     * <sort direction> ::= ASC | DESC
     */
    groupBy(...groups) {
        this.groups = groups;

        return this;
    }

    /**
     * Group by clause
     */
    groupByClause() {
        if(this.groups.length === 0)
            return '';

        return `GROUP BY ${SQLBuilder.getSorts(this.groups)}`;
    }

    /**
     * <having clause> ::=
     *      HAVING <condition>
     */
    having(aggr, conditional, value) {
        this.havings = [aggr, conditional, value];

        return this;
    }

    /**
     * Having clause
     */
    havingClause() {
        if(this.havings.length === 0)
            return '';

        const [aggr, conditional, value] = this.havings;

        this.values.push(value);

        return `HAVING ${aggr}${conditional}$${this.values.length}`;
    }
}

module.exports = SQLBuilder;
