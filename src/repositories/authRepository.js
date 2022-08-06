import db from "../database/postgres.js";


async function findWithEmail(email){
    return db.query("SELECT * FROM users WHERE email = $1",[email]);
}

async function insertNewUser(name,email,cryptedPassword){
    return db.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',[name,email,cryptedPassword]);
}

export const authRepository = {
    findWithEmail,
    insertNewUser
}