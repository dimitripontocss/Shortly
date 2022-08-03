import db from "../database/postgres.js";

import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";

export async function getUserInfo(req,res){
    const {id:userId} = res.locals.data;
    try{
        const possibleUser = await db.query('SELECT * FROM users WHERE id=$1',[userId]);
        if(possibleUser.rowCount===0){
            throw new ApiError("Não existem usuários com este id.",404);
        }
        const {rows: userInfo} = await db.query(`SELECT users.id, users.name, SUM("shortenedUrls"."visitCount") as "visitCount" 
                                         FROM users 
                                         JOIN "shortenedUrls" 
                                         ON "shortenedUrls"."userId" = users.id 
                                         WHERE users.id = $1
                                         GROUP BY users.id`,[userId]);
        
        const {rows: shortenedUrls} = await db.query(`SELECT id, "shortUrl", url, "visitCount"
                                         FROM "shortenedUrls"
                                         WHERE "userId"=$1
                                         ORDER BY id ASC`,[userId]);

        const {id,name,visitCount} = userInfo[0];
        const sendableInfo = {
            id,
            name,
            visitCount,
            shortenedUrls
        }
        
        res.status(200).send(sendableInfo);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
    }
}