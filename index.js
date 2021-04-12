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

}

module.exports = SQLBuilder;
