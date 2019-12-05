
module.exports = function(config) {
    var option = {
        client:config.type,
        connection: {
            host:config.host,
            user:config.user,
            password:config.password,
            database:config.database
        },
        pool: {min:0,max:10}
    };
    if(config.pool) {
        option.pool.min = parseInt(config.pool.min);
        option.pool.max = parseInt(config.pool.max);
    }
    var db_connector = require('knex')(option);

    this.executeQuery = function(query) {
        return db_connector.raw(query);
    }

    return this;
};