const OracleDB = require("oracledb");

oracledb = require("oracledb");
oracledb.autoCommit = true;

async function startup() {
    console.log("Starting up Database.");
    await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectstring: process.env.connectstring,
        poolMin: 4,
        poolMax: 10,
        poolIncrement: 1,
    });
    console.log("pool created");
}

async function shutdown() {
    console.log("shutting sown database");
    try {
        await oracledb.getPool().close(10);
        console.log("Pool Closed");
    } catch (err) {
        console.log("ERROR shutting down database: " + err.message);
    }
}

async function execute(sql, binds, options) {
    let connection, results;
    try {
        connection = await oracledb.getConnection();
        results = await connection.execute(sql, binds, options);
    } catch (err) {
        console.log("ERROR executing sql: " + err.message);
    } finally {
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.log("ERROR closing connection: " + err);
            }
        }
    }
    return results;
}

async function executeMany(sql, binds, options) {
    let connection;
    try {
        // Get a connection from the default pool
        connection = await oracledb.getConnection();
        await connection.executeMany(sql, binds, options);
    } catch (err) {
        console.log("ERROR executing sql: " + err.message);
    } finally {
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.log("ERROR closing connection: " + err);
            }
        }
    }

    return;
}

// options for execution sql
const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
};

module.exports = {
    startup,
    shutdown,
    execute,
    executeMany,
    options,
};
