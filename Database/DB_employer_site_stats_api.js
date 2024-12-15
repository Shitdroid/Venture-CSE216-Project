const database = require("./database");

async function getMostSoldServicesOfLastMonth() {
    const sql = `
        SELECT B.SERVICE_ID AS ID, S.PRICE AS COST, S.PICTURE AS PIC,S.TITLE AS HEADER,S.DESCRIPTION AS DSCRPTN,(S.TOTAL_RATING/S.RATING_COUNT) AS RATING
        FROM Buys B
        JOIN Service S on B.service_id = S.service_id
        WHERE months_between(sysdate, B.time_of_purchase) <= 1
        GROUP BY B.Service_ID,S.PRICE, S.PICTURE,S.TITLE,S.DESCRIPTION,S.RATING_COUNT,S.TOTAL_RATING
        ORDER BY COUNT(*) desc
        fetch first 10 rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getCreatedJobs(id) {
    const sql = `
        SELECT JOB_ID, TITLE, DESCRIPTION, STATUS, get_min_bid(JOB_ID) AS COST,DAYS_GIVEN,END_TIME,PICTURE 
        FROM JOB 
        WHERE EMPLOYER_ID = ${id}
        ORDER BY STATUS desc
    `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getBoughtServices(id) {
    const sql = `
        SELECT B.SERVICE_ID AS ID, S.PRICE AS COST, S.PICTURE AS PIC,S.TITLE AS HEADER,(S.TOTAL_RATING/S.RATING_COUNT) AS RATING
        FROM Buys B
        JOIN Service S on S.service_id = B.service_id
        WHERE B.EMPLOYER_ID = ${id}
        ORDER BY B.time_of_purchase desc
        fetch first 10 rows only
        `;
    const binds = {};

    return (await database.execute(sql, binds, database.options)).rows;
}

async function getRecentlySoldServices() {
    const sql = `
        SELECT SERVICE_ID, PRICE, PICTURE, TITLE, DESCRIPTION, ((TOTAL_RATING/RATING_COUNT)) AS RATING
        FROM Service
        ORDER BY last_purchase(SERVICE_ID) desc
        fetch first 10 rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getHighestRatedServices() {
    const sql = `
        SELECT SERVICE_ID,PRICE, PICTURE,TITLE,DESCRIPTION,(TOTAL_RATING/RATING_COUNT) AS RATING
        FROM Service
        ORDER BY (TOTAL_RATING/RATING_COUNT) desc
        fetch first 10 rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getMostPreferredServices(id) {
    const sql = `
        SELECT SERVICE_ID,PRICE, PICTURE,TITLE,DESCRIPTION,(TOTAL_RATING/RATING_COUNT) AS RATING
        FROM Service
        ORDER BY get_preference_priority(service_id,${id}) desc, (TOTAL_RATING/RATING_COUNT) desc
        fetch first 10 rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getFilteredSearchItems(filters, searchKey, offset, limit) {
    const sql = `
        SELECT D.SERVICE_ID,D.PRICE, D.PICTURE,D.TITLE,D.DESCRIPTION,(D.TOTAL_RATING/D.RATING_COUNT) AS RATING
        FROM (
            SELECT SERVICE_ID,PRICE, PICTURE,TITLE,DESCRIPTION,DAYS_TAKEN,RATING_COUNT,TOTAL_RATING
            FROM Service
            WHERE DAYS_TAKEN>=${filters.days_taken}
            AND DAYS_TAKEN<=${filters.days_taken2}
            AND PRICE >= ${filters.price}
            AND PRICE <= ${filters.price2}
            AND (TOTAL_RATING/RATING_COUNT) >= ${filters.rating}
            ORDER BY (TOTAL_RATING/RATING_COUNT) desc
        ) D
        JOIN HAS H on H.service_id = S.service_id
        JOIN Tag T on T.tag_id = H.tag_id
        WHERE D.TITLE LIKE '%${searchKey}%'
        OR D.DESCRIPTION LIKE %${searchKey}%'
        OR T.tag_name LIKE '%${searchKey}%'
        OR T.type LIKE '%${searchKey}%'
        ORDER BY TOTAL_RATING desc
        offset ${offset} rows
        fetch first ${limit} rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getUnfilteredSearchItems(searchKey, offset, limit) {
    const sql = `
        SELECT D.SERVICE_ID AS ID,D.PRICE AS COST, D.PICTURE AS PIC,D.TITLE AS HEADER,D.DESCRIPTION AS DSCRPTN,(D.TOTAL_RATING/D.RATING_COUNT) AS RATING
        FROM Service D
        JOIN HAS H on H.service_id = D.service_id
        JOIN Tag T on T.tag_id = H.tag_id
        WHERE D.TITLE LIKE '%${searchKey}%'
        OR D.DESCRIPTION LIKE %${searchKey}%'
        OR T.tag_name LIKE '%${searchKey}%'
        OR T.type LIKE '%${searchKey}%'
        ORDER BY TOTAL_RATING desc
        offset ${offset} rows
        fetch first ${limit} rows only
        `;
    const binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getHighestRatedServices,
    getMostSoldServicesOfLastMonth,
    getCreatedJobs,
    getBoughtServices,
    getUnfilteredSearchItems,
    getRecentlySoldServices,
    getMostPreferredServices,
    getFilteredSearchItems,
};
