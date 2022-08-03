import { nanoid } from "nanoid"

import db from "../database/postgres.js"

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
        const possibleUser = await db.query('SELECT * FROM users WHERE id=$1 and email=$2',[id,email]);
        if(possibleUser.rowCount === 0){
            throw new ApiError("Ocorreram erros na autenticação.",401);
        }
        const shortUrl = nanoid(10,url);

        await db.query('INSERT INTO "shortenedUrls" ("userId", "shortUrl", url, "visitCount") VALUES ($1,$2,$3,$4)',[id,shortUrl,url,0]);
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
        const possibleUrl = await db.query('SELECT id,"shortUrl",url FROM "shortenedUrls" WHERE id=$1',[id]);
        if(possibleUrl.rowCount === 0){
            throw new ApiError("Não foi possível encontrar url com esse id.",404);
        }
        res.status(200).send(possibleUrl.rows);
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
        const possibleUrl = await db.query('SELECT url,"visitCount" FROM "shortenedUrls" WHERE "shortUrl"=$1',[shortUrl]);
        if(possibleUrl.rowCount === 0){
            throw new ApiError("Não foi possível encontrar url com esse id.",404);
        }
        const { url,visitCount } = (possibleUrl.rows[0]);
        await db.query('UPDATE "shortenedUrls" SET "visitCount" = $1 WHERE "shortUrl"=$2',[visitCount+1,shortUrl]);
        
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
        const possibleUrl = await db.query('SELECT * FROM "shortenedUrls" WHERE id=$1 AND "userId"=$2',[id,userId]);
        if(possibleUrl.rowCount === 0){
            throw new ApiError("Não foi possível encontrar url com esse id.",401);
        }
        await db.query('DELETE FROM "shortenedUrls" WHERE id=$1',[id]);
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
