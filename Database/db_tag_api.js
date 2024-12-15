const database = require("./database");

//get all tags
async function getAllTags() {
    const sql = `
        SELECT TAG_ID, TAG_NAME, TYPE
        FROM TAG
    `;
    binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertServiceTags(service_id, tags) {
    const sql = `
        INSERT INTO HAS (SERVICE_ID, TAG_ID)
        VALUES (${service_id}, :1)
    `;
    binds = tags;
    return await database.executeMany(sql, binds, database.options);
}

async function insertJobTags(job_id, tags) {
    const sql = `
        INSERT INTO skills_needed (JOB_ID, TAG_ID)
        VALUES (${job_id}, :1)
    `;
    binds = tags;
    return await database.executeMany(sql, binds, database.options);
}

async function getServiceTags(service_id) {
    const sql = `
        SELECT T.TAG_ID AS ID, T.TAG_NAME AS NAME, T.TYPE AS CATEGORY
        FROM HAS H JOIN TAG T ON T.TAG_ID=H.TAG_ID
        WHERE SERVICE_ID = ${service_id}
    `;
    binds = {};
    return await database.execute(sql, binds, database.options);
}
async function getJobTags(job_id) {
    const sql = `
        SELECT T.TAG_ID AS ID, T.TAG_NAME AS NAME, T.TYPE AS CATEGORY
        FROM skills_needed H JOIN TAG T ON T.TAG_ID=H.TAG_ID
        WHERE JOB_ID = ${job_id}
    `;
    binds = {};
    return await database.execute(sql, binds, database.options);
}
module.exports = {
    getAllTags,
    insertJobTags,
    insertServiceTags,
    getServiceTags,
    getJobTags,
};
