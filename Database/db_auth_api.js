const database = require("./database");

// function to get id from email
async function getUserIDByEmail(email) {
    const sql = `
        SELECT 
            USER_ID
        FROM 
            USERS
        WHERE 
            EMAIL_ID = :email
        `;
    const binds = {
        email: email,
    };

    return (await database.execute(sql, binds, database.options)).rows;
}

// function to create new user
// user should have handle, email, pass, dob
// {id} will be returned
async function createNewUser(user) {
    const sql = `
        INSERT INTO
            USERS(FIRST_NAME,LAST_NAME,EMAIL_ID, PASSWORD,PHONE,PICTURE,DOB)
        VALUES 
            (:first_name,:last_name,:email,:password,:phone,:picture,TO_DATE(:dob,'YYYY-MM-DD'))
    `;
    const binds = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        picture: user.picture,
        phone: user.phone,
        dob: user.DOB,
    };
    await database.execute(sql, binds, {});
    let result = await getUserIDByEmail(user.email);
    const sql2 = `
        BEGIN
        insert_type_user(:id,:type,:bio);
        END;
    `;
    binds2 = {
        id: result[0].USER_ID,
        type: user.type,
        bio: user.bio,
    };
    await database.execute(sql2, binds2, {});
    return result;
}

async function updateUser(user) {
    const sql = `
        UPDATE USERS
        SET 
        FIRST_NAME=:first_name,
        LAST_NAME=:last_name,
        EMAIL_ID=:email, 
        PASSWORD=:password,
        PHONE=:phone,
        PICTURE=:picture,
        DOB=:dob
        WHERE USER_ID=:id
    `;
    const binds = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        picture: user.picture,
        phone: user.phone,
        dob: user.dob,
    };
    return await database.execute(sql, binds, {});
}

async function getLoginInfoByEmail(email) {
    const sql = `
        SELECT
            USER_ID,
            FIRST_NAME,
            LAST_NAME,
            PASSWORD
        FROM
            USERS
        WHERE
            EMAIL_ID = :email
    `;
    const binds = {
        email: email,
    };

    return (await database.execute(sql, binds, database.options)).rows;
}

async function getLoginInfoByID(id) {
    const sql = `
        SELECT
            USER_ID,
            FIRST_NAME,
            LAST_NAME,
            PASSWORD,
            EMAIL_ID,
            PICTURE,
            PHONE,
            get_type(USER_ID) AS TYPE
        FROM
            USERS
        WHERE
            USER_ID = ${id}
    `;
    const binds = {};

    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getLoginInfoByEmail,
    createNewUser,
    updateUser,
    getLoginInfoByID,
    getUserIDByEmail,
};
