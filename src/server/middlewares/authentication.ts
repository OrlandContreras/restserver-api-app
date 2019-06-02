import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUserModel } from '../models/user';

dotenv.config();
let seed: string;

if (process.env.NODE_ENV === 'dev') {
    seed = <string>process.env.SEED_TOKEN_DEV;
}else {
    seed = <string>process.env.SEED_TOKEN_PROD;
}


// Verify Token
export const verifyToken = ( req: any, res: any, next: any ) => {

    let token = req.get('Authorization');

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
export const verifyAdminRole = ( req: any, res: any, next: any ) => {

    let user = <IUserModel> req.user;

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
