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
    // Only initialize attributes used for every method
    constructor() {
        this.statement = null;
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
        let query = 'SELECT';

        // Add select clause
        const elementsList = this.columns.reduce((colList, col, index) => {
            if(col instanceof Array) {
                const [name, alias] = col;

                return (index > 0) ? `${colList}, ${name} AS ${alias}` : `${name} AS ${alias}`;
            }

            return (index > 0) ? `${colList}, ${col}` : `${col}`;
        });
        query += ` ${elementsList}`;

        // Finish
        query += ';';

        return query;
    }
}

module.exports = SQLBuilder;
