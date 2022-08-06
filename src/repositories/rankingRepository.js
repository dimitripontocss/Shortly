import db from "../database/postgres.js";

async function getRanking(){
    return await db.query(`SELECT users.id, users.name, COUNT("shortenedUrls".id) as "linksCount", SUM("shortenedUrls"."visitCount") as "visitCount" 
                           FROM users 
                           JOIN "shortenedUrls" 
                           ON "shortenedUrls"."userId" = users.id 
                           GROUP BY users.id 
                           ORDER BY "visitCount" DESC
                           LIMIT 10`);
}

export const rankingRepository = {
    getRanking
}