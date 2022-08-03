import bcrypt from "bcrypt";

import db from "../database/postgres.js";

import {signupSchema,signinSchema} from "../schemas/userSchemas.js";

import ApiError from "../utils/apiError.js"
import handleError from "../utils/handleError.js"
import jwtGenerator from "../utils/jwtGenerator.js"

export async function signup(req,res){
    const {name, email, password, confirmPassword} = req.body;
    try{
        const { error } = signupSchema.validate(req.body);
		if(error){
			throw new ApiError("Prencha todos os campos corretamente.",422);
		}
        const alreadyExist = await db.query("SELECT * FROM users WHERE email = $1",[email])
        if(alreadyExist.rowCount !== 0){
            throw new ApiError("Email já esta cadastrado.",409);
        }
        if(password !== confirmPassword){
            throw new ApiError("Prencha todos os campos corretamente.",422);
        }
        const cryptedPassword = bcrypt.hashSync(password, 10); 

        await db.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',[name,email,cryptedPassword]);
        res.sendStatus(201);
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
	}
}

export async function signin(req,res){
    const {email, password} = req.body;
    try{
        const { error } = signinSchema.validate(req.body);
		if(error){
			throw new ApiError("Prencha todos os campos corretamente.",422);
		}
        const {rows: possibleUser} = await db.query("SELECT * FROM users WHERE email = $1",[email])
        if(possibleUser.length === 0){
            throw new ApiError("Erro na verificação de senha ou email.",401);
        }

        const passwordValidate = bcrypt.compareSync(password, possibleUser[0].password);
        if(passwordValidate){
            const data = {
				email: possibleUser[0].email,
				id: possibleUser[0].id
			}
            const token = jwtGenerator(data);
            res.status(200).send(token)
        }else{
            throw new ApiError("Erro na verificação de senha ou email.",401);
        }
    }catch(error){
        console.log(error);
		if(error instanceof ApiError){
			const {status ,message} = error;
			return handleError({status, message, res});
		}
		return handleError({status:500, msg:error.message, res})
	}
}