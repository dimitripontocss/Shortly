import ApiError from "../utils/apiError.js";
import handleError from "../utils/handleError.js";

import { rankingRepository } from "../repositories/rankingRepository.js";

export async function getRanking(req,res){
    try{
        const {rows: ranking} = await rankingRepository.getRanking();
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