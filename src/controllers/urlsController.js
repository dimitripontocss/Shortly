import { nanoid } from "nanoid"

import { urlRepository } from "../repositories/urlsRepository.js"

import { urlSchema } from "../schemas/urlSchemas.js"

import ApiError from "../utils/apiError.js"
import handleError from "../utils/handleError.js"


export async function postShortUrl(req,res){
    const {email, id} = res.locals.data;
    const {url} = req.body;
    try{
        const { error } = urlSchema.validate(req.body);
		if(error){
			throw new ApiError("Este não é um url válido.",422);
		}
        const possibleUser = await urlRepository.validateIdEmail(id,email)
        if(possibleUser.rowCount === 0){
            throw new ApiError("Ocorreram erros na autenticação.",401);
        }
        const shortUrl = nanoid(10,url);

        await urlRepository.insertShortUrl(id,shortUrl,url);
        res.status(201).send({shortUrl})
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
    }
}


export async function getUrlById(req,res){
    const id = req.params.id;
    try{
        const possibleUrl = await urlRepository.selectUrlbyId(id);
        if(possibleUrl.rowCount === 0){
            throw new ApiError("Não foi possível encontrar url com esse id.",404);
        }
        res.status(200).send(possibleUrl.rows[0]);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
    }
}


export async function redirectToUrl(req,res){
    const shortUrl = req.params.shortUrl;
    console.log(shortUrl);
    try{
        const possibleUrl = await urlRepository.selectUrlbyShortUrl(shortUrl);
        if(possibleUrl.rowCount === 0){
            throw new ApiError("Não foi possível encontrar url com esse id.",404);
        }
        const { url,visitCount } = (possibleUrl.rows[0]);
        await urlRepository.updateUrlViewCount(visitCount,shortUrl);
        
        res.redirect(url);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
    }
}


export async function deleteUrl(req,res){
    const id = req.params.id;
    const {id: userId} = res.locals.data;
    try{
        const possibleUrl = await urlRepository.selectUrlbyIdandUserId(id,userId);
        if(possibleUrl.rowCount === 0){
            throw new ApiError("Não foi possível encontrar url com esse id.",401);
        }
        await urlRepository.deleteUrl(id);
        res.sendStatus(204);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
    }
}
