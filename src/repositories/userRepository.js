import db from "../database/postgres.js";

async function selectUserbyId(userId){
    return await db.query('SELECT * FROM users WHERE id=$1',[userId]);
}

async function selectUserInfo(userId){
    return await db.query(`SELECT users.id, users.name, SUM("shortenedUrls"."visitCount") as "visitCount" 
                           FROM users 
                           JOIN "shortenedUrls" 
                           ON "shortenedUrls"."userId" = users.id 
                           WHERE users.id = $1
                           GROUP BY users.id`,[userId]);
}

async function selectUserUrls(userId){
    return await db.query(`SELECT id, "shortUrl", url, "visitCount"
                           FROM "shortenedUrls"
                           WHERE "userId"=$1
                           ORDER BY id ASC`,[userId]);
}

export const userRepository = {
    selectUserbyId,
    selectUserInfo,
    selectUserUrls
}