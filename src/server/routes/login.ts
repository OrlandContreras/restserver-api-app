import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

import { User, IUserModel } from '../models/user';

dotenv.config();

const appLoginRoute = express();
let seed: string;

if (process.env.NODE_ENV === 'dev') {
    seed = <string>process.env.SEED_TOKEN_DEV;
}else {
    seed = <string>process.env.SEED_TOKEN_PROD;
}

const client = new OAuth2Client(process.env.CLIENT_ID);


// POST
export const loginRoute = appLoginRoute.post('/login', (req, res) => {
    
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

// Google configuration
async function verify( token: any ) {
    
    let CLIENT_ID: string = <string>process.env.CLIENT_ID;
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload: any = ticket.getPayload();

    return new User ({
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    });
  } 

export const googleSignIn = appLoginRoute.post('/google', async (req, res) => {
    
    let token = req.body.idtoken;

    let googleUser = <IUserModel> await verify(token)
                            .catch( err => {
                                return res.status(403).json({
                                    ok: false,
                                    err
                                });
                            });
    
    User.findOne({
        email: googleUser.email
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You must be use authentication with your username and password'
                    }
                });
            } else {
                token =  jwt.sign({ user: userDB }, 
                                        seed, 
                                        { 
                                            expiresIn: Number(process.env.EXPIRES_TOKEN) 
                                        }
                                    );
                return res.json({
                    ok: true,
                    user: userDB
                });
            }
        } else {

            googleUser.password = bcrypt.hashSync(':)', 10);

            googleUser.save( (err, userDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
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
        }
    });
});