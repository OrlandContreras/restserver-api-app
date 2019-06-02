import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
let seed: string;

if (process.env.NODE_ENV === 'dev') {
    seed = <string>process.env.SEED_TOKEN_DEV;
}else {
    seed = <string>process.env.SEED_TOKEN_PROD;
}

// Verify Token
export const verifyToken = ( req: any, res: Response, next: NextFunction ) => {

    let token = <string> req.get('Authorization');

    jwt.verify( token, seed, (err: any, decoded: any) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalid!'
                }
            });
        }

        req.user = decoded.user;
        next();
    });

};

// Verify Admin Role
export const verifyAdminRole = ( req: any, res: Response, next: NextFunction ) => {
    
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();       
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'The user is no administrator'
            }
        });
    }
};
