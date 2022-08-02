import jwt from "jsonwebtoken";

export default function (data){
    const key = process.env.SENHA_JWT;
    const config = { expiresIn: 60*60*24 };//Expira em 1 dia
    const token = jwt.sign(data, key, config);
    return token;
}