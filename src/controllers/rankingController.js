import db from "../database/postgres.js";

import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";

export async function getRanking(req,res){
    try{
        const {rows: ranking} = await db.query(`SELECT users.id, users.name, COUNT("shortenedUrls".id) as "linksCount", SUM("shortenedUrls"."visitCount") as "visitCount" 
                                                FROM users 
                                                JOIN "shortenedUrls" 
                                                ON "shortenedUrls"."userId" = users.id 
                                                GROUP BY users.id 
                                                ORDER BY "visitCount" DESC
                                                LIMIT 10`);
        res.status(200).send(ranking);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
    }
}