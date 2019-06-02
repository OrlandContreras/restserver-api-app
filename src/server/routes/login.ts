import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '../models/user';

const appLoginRoute = express();
let seed: string;


dotenv.config();

if (process.env.NODE_ENV === 'dev') {
    seed = <string>process.env.SEED_TOKEN_DEV;
}else {
    seed = <string>process.env.SEED_TOKEN_PROD;
}


// POST
appLoginRoute.post('/login', (req, res) => {
    
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or Password incorrects'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or Password incorrects'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, seed, { expiresIn: Number(process.env.EXPIRES_TOKEN) });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });    
});

export default appLoginRoute;