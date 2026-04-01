import jwt from 'jsonwebtoken';
import 'dotenv/config'

const chaveSecreta = process.env.CHAVE_JWT


export function AuthMiddleware(req, res, next){
const authHeader = req.headers.authorization;
console.log(authHeader)
if (!authHeader){
    return res.status(401).json({ error: 'Token não fornecido'});
}

const [, token] = authHeader.split(' ');


try{
    const decoded = jwt.verify(token, chaveSecreta );
    console.log(decoded)
    req.userId = decoded.id;
    req.user = decoded;
    req.role = decoded.role;
    next();
} catch(error){
    return res.status(401).json({ error: 'Token inválido'})
}
}