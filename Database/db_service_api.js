const database = require("./database");

async function createService(service) {
    const sql = `
        INSERT INTO
            SERVICE(PRICE,PICTURE,DESCRIPTION, TITLE, DAYS_TAKEN, FREELANCER_ID)
        VALUES 
            (:price,:picture,:description,:title,:days_taken,:id)
    `;
    const binds = {
        price: service.price,
        picture: service.picture,
        description: service.description,
        days_taken: service.days_taken,
        title: service.title,
        id: service.id,
    };
    await database.execute(sql, binds, database.options);
    const sql2=`
        SELECT SERVICE_ID
        FROM SERVICE
        WHERE PICTURE=:picture`
        ;
    const binds2 = {
        picture: service.picture,
    };
    const result = await database.execute(sql2, binds2, database.options).rows;
    service.tags.forEach((tag) => {
        sql = `
        INSERT INTO
            HAS(SERVICE_ID,TAG_ID)
        VALUES
            (:service_id,:tag_id)
        `;
        binds={
            service_id: result[0].SERVICE_ID,
            tag_id:tag,
        }
        await database.execute(sql,binds,{});    
    })
    return result[0].SERVICE_ID;
}   
async function deleteService(id){
    const sql = `
        DELETE FROM SERVICE
        WHERE SERVICE_ID=:id
    `;
    const binds = {
        id: id
    };
    return await database.execute(sql, binds, database.options);
}
async function updateService(service) {
    const sql = `
        UPDATE Service 
        SET
        PRICE=:price,
        PICTURE=:picture,
        DESCRIPTION=:description, 
        TITLE=:title
        DAYS_TAKEN=:days_taken
        WHERE SERVICE_ID=:id
    `;
    const binds = {
        id: service.id,
        price: service.price,
        picture: service.picture,
        description: service.description,
        title: service.title,
        days_taken: service.days_taken,
    };
    return await database.execute(sql,binds,database.options);
    
    
}   

async function getServiceByID(id){
    const sql = `
        SELECT SERVICE_ID,PRICE,PICTURE,DESCRIPTION,TITLE,DAYS_TAKEN,(RATING_COUNT/TOTAL_RATING) AS RATING,FREELANCER_ID
        FROM SERVICE
        WHERE SERVICE_ID=:id
    `;
    const binds = {
        id: id
    };
    return await database.execute(sql, binds, database.options);
}

module.exports={
    createService,
    updateService,
    getServiceByID,
    deleteService,
}