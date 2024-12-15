const database = require("./database");

async function getTakenJobs(id) {
    const sql = `
        SELECT JOB_ID, TITLE, DESCRIPTION, STATUS, PRICE,DAYS_GIVEN,END_TIME,PICTURE, EMPLOYER_ID 
        FROM JOB 
        WHERE FREELANCER_ID = ${id}
        ORDER BY STATUS desc
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getCreatedServices(id) {
    const sql = `
        SELECT SERVICE_ID, TITLE, DESCRIPTION, PRICE, DAYS_TAKEN,(TOTAL_RATING/RATING_COUNT) AS RATING,PICTURE 
        FROM Service 
        WHERE FREELANCER_ID = ${id}
        ORDER BY get_popularity(SERVICE_ID) desc
    `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getMostPreferredJobs(id) {
    const sql = `
        SELECT JOB_ID, TITLE, DESCRIPTION, STATUS,DAYS_GIVEN,END_TIME,PICTURE,EMPLOYER_ID,get_min_bid(JOB_ID) AS COST
        FROM Job
        WHERE status = 'Taking Responses'
        ORDER BY get_skillset_priority(JOB_ID,${id}) desc
        fetch first 10 rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getFilteredSearchItems(filters, searchKey, offset, limit) {
    const sql = `
        SELECT D.JOB_ID AS ID,get_min_bid(D.JOB_ID) AS COST, D.PICTURE AS PIC,D.TITLE AS HEADER,D.DESCRIPTION AS DSCRPTN,D.DAYS_GIVEN AS DAYS, D.END_TIME AS ENDING_TIME
        FROM (
            SELECT JOB_ID, PICTURE,TITLE,DESCRIPTION,DAYS_GIVEN,END_TIME,PRICE,RATING_COUNT,TOTAL_RATING
            FROM Service
            WHERE DAYS_GIVEN>=${filters.days_given}
            AND DAYS_TAKEN<=${filters.days_given2}
            AND END_TIME >= ${filters.end_time}
            AND END_TIME <= ${filters.end_time2}
            AND STATUS = 'Taking Responses'
            ORDER BY END_TIME
        ) D
        JOIN Skills_needed H on H.job_id = D.job_id
        JOIN Tag T on T.tag_id = H.tag_id
        WHERE (D.TITLE LIKE '%${searchKey}%'
        OR D.DESCRIPTION LIKE %${searchKey}%'
        OR T.tag_name LIKE '%${searchKey}%'
        OR T.type LIKE '%${searchKey}%')
        AND status = 'Taking Responses'
        ORDER BY D.end_time 
        offset ${offset} rows
        fetch first ${limit} rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getUnfilteredSearchItems(searchKey, offset, limit) {
    const sql = `
        SELECT D.JOB_ID AS ID,get_min_bid(D.JOB_ID) AS COST, D.PICTURE AS PIC,D.TITLE AS HEADER,D.DESCRIPTION AS DSCRPTN,D.DAYS_GIVEN AS DAYS, D.END_TIME AS ENDING_TIME
        FROM Job D
        JOIN Skills_needed H on H.job_id = D.job_id
        JOIN Tag T on T.tag_id = H.tag_id
        WHERE (D.TITLE LIKE '%${searchKey}%'
        OR D.DESCRIPTION LIKE %${searchKey}%'
        OR T.tag_name LIKE '%${searchKey}%'
        OR T.type LIKE '%${searchKey}%')
        AND status = 'Taking Responses'
        ORDER BY D.end_time 
        offset ${offset} rows
        fetch first ${limit} rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getTakenJobs,
    getCreatedServices,
    getMostPreferredJobs,
    getUnfilteredSearchItems,
    getFilteredSearchItems,
};
