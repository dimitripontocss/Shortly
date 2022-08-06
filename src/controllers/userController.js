import db from "../database/postgres.js";

import { userRepository } from "../repositories/userRepository.js";

import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";

export async function getUserInfo(req,res){
    const {id:userId} = res.locals.data;
    try{
        const possibleUser = await userRepository.selectUserbyId(userId);
        if(possibleUser.rowCount===0){
            throw new ApiError("Não existem usuários com este id.",404);
        }
        const {rows: userInfo} = await userRepository.selectUserInfo(userId);
        console.log(userInfo)
        if(userInfo.length===0){
            const user = possibleUser.rows[0];
            return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    visitCount: 0,
                    shortenedUrls:[]
            })
        }
        
        const {rows: shortenedUrls} = await userRepository.selectUserUrls(userId);

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