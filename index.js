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
        const elementsList = elements.reduce((colList, col, index) => {
            if(col instanceof Array) {
                const [name, alias] = col;

                return (index > 0) ? `${colList}, ${name} AS ${alias}` : `${name} AS ${alias}`;
            }

            return (index > 0) ? `${colList}, ${col}` : `${col}`;
        });

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

        // Initialize everything needed for select statements
        query.statement = 'select';
        query.columns = ["*"];
        query.values = [];

        if(columns.length !== 0)
            query.columns = columns;

        return query;
    }

    /**
     * Select statement string
     */
    selectStatement() {
        let query = '';

        /* Add select clause */
        query += `SELECT ${SQLBuilder.getList(this.columns)}`;

        /* Add from clause */
        if(this.tables)
            query += ` FROM ${SQLBuilder.getList(this.tables)}`;

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
}

module.exports = SQLBuilder;
