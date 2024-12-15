const database = require("./database");

async function updateProfile(user) {
    const sql = `
        UPDATE USERS 
        SET
        FIRST_NAME=:first_name,
        LAST_NAME=:last_name,
        EMAIL_ID=:email, 
        PHONE=:phone,
        DOB=:dob
        WHERE ID = :id
    `;
    const binds = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
    };
    return await database.execute(sql, binds, database.options);
}

async function updateEmployer(user) {
    return await updateProfile(user);
}

async function updateFreelancer(user) {
    await updateProfile(user);
    const sql = `
        UPDATE FREELANCER
        SET BIO=:bio
    `;
    const binds = {
        bio: user.bio,
    };
    return await database.execute(sql, binds, database.options);
}

async function getEmployer(user_Id) {
    const sql = `
        SELECT 
            DOB
        FROM 
            USERS
        WHERE 
            user_id = :user_Id
        `;
    const binds = {
        user_Id: user_Id,
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getFreeLancer(user_Id) {
    const sql = `
        SELECT 
            DOB,BIO
        FROM 
            Freelancer
        WHERE 
            id = :user_Id
        `;
    const binds = {
        user_Id: user_Id,
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function deleteUser(user_Id) {
    const sql = `
        DELETE FROM USERS
        WHERE ID = :user_Id
        `;
    const binds = {
        user_Id: user_Id,
    };
    return await database.execute(sql, binds, database.options);
}

module.exports = {
    getFreeLancer,
    getEmployer,
    updateFreelancer,
    updateEmployer,
    deleteUser,
};
