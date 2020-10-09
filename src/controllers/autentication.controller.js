import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as User from '../controllers/user.controller';
import * as crypto from '../util/util';

export const generateToken = async(req,res)=>{
    const app = express();
    app.set('appKey', config.APP_KEY);
    
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await User.getUsers(username, password);

    if(!findUser.valid){
        res.json({mensaje:"Request Invalido"});
    }else{
        const payload = {
            check:  true
        };
        const token = jwt.sign(payload, app.get('appKey'), {
            expiresIn: 1440
        });
        
       if(token){
           res.json({
               mensaje: 'Autenticación correcta',
               token: token
           });
       
       }
    };
        
}

export const encrypt = async(data,key)=>{
    let dataString = '';
    if (typeof data === 'string') {
        dataString = data;
    } else if (data) {
        dataString = JSON.stringify(data);
      }
    const result = await crypto.encryptAES256(data,key);
    return result;
}


export const decrypt = async(data,key)=>{
    let result;
    if (typeof data === 'string') {
      const decryptedValue = await crypto.decryptAES256(data, key);
      result = decryptedValue;
    }
    return result;
}
