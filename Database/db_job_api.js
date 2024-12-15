const database = require('./database');

//insert a new job into the database
async function createJob(job,skills) {
    const sql = `
        INSERT INTO
            JOBS(EMPLOYER_ID,TITLE,PICTURE,DESCRIPTION,END_TIME,DAYS_GIVEN)
        VALUES 
            (:employer_id,:title,:picture,:description,:end_time,:days)
    `;
    const binds = {
        employer_id: job.employer_id,
        title: job.title,
        picture: job.picture,
        description: job.description,
        days: job.days,
        end_time: job.end_time,
    };
    await database.execute(sql, binds, {});
    const sql2 = `
        SELECT JOB_ID
        FROM Jobs
        WHERE PICTURE=:picture`;
    const binds2 = {
        picture: service.picture,
    };
    const result = await database.execute(sql2, binds2, database.options).rows;
    skills.forEach((tag) => {
        let sql3 = `
        INSERT INTO
            Skills_needed(JOB_ID,TAG_ID)
        VALUES
            (:job_id,:tag_id)
        `;
        let binds3={
            job_id: result[0].JOB_ID,
            tag_id:tag,
        }
        await database.execute(sql3,binds3,database.options);   
    })
    return result[0].JOB_ID;
}

async function deleteJob(id){
    const sql = `
        DELETE FROM JOBS
        WHERE JOB_ID=:id
    `;
    const binds = {
        id: id
    };
    return await database.execute(sql, binds, database.options);
}

async function getJobByID(id){
    const sql = `
        SELECT JOB_ID,PRICE,PICTURE,DESCRIPTION,TITLE,DAYS_GIVEN,EMPLOYER_ID,FREELANCER_ID,END_TIME,STATUS
        FROM JOB
        WHERE JOB_ID=:id
    `;
    const binds = {
        id: id
    };
    return await database.execute(sql, binds, database.options);
}

module.exports = {
    createJob,
    deleteJob,
    getJobByID,
};