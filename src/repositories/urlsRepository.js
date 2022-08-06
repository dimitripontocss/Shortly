import db from "../database/postgres.js";

async function validateIdEmail(id,email){
    return await db.query('SELECT * FROM users WHERE id=$1 and email=$2',[id,email]);
}


async function insertShortUrl(id,shortUrl,url){
    return await db.query('INSERT INTO "shortenedUrls" ("userId", "shortUrl", url, "visitCount") VALUES ($1,$2,$3,$4)',[id,shortUrl,url,0]);
}

async function selectUrlbyId(id){
    return await db.query('SELECT id,"shortUrl",url FROM "shortenedUrls" WHERE id=$1',[id]);
}

async function selectUrlbyShortUrl(shortUrl){
    return await db.query('SELECT url,"visitCount" FROM "shortenedUrls" WHERE "shortUrl"=$1',[shortUrl]);
}

async function updateUrlViewCount(visitCount,shortUrl){
    return await db.query('UPDATE "shortenedUrls" SET "visitCount" = $1 WHERE "shortUrl"=$2',[visitCount+1,shortUrl]);
}

async function selectUrlbyIdandUserId(id,userId){
    return await db.query('SELECT * FROM "shortenedUrls" WHERE id=$1 AND "userId"=$2',[id,userId]);
}

async function deleteUrl(id){
    return await db.query('DELETE FROM "shortenedUrls" WHERE id=$1',[id]);
}

export const urlRepository = {
    validateIdEmail,
    insertShortUrl,
    selectUrlbyId,
    selectUrlbyShortUrl,
    updateUrlViewCount,
    selectUrlbyIdandUserId,
    deleteUrl
}