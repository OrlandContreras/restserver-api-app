import { Response, Request, NextFunction } from "express";
import bcrypt from 'bcrypt';
import _ from 'underscore';
import { User } from '../models/user';

// GET: Get all users
export const getAllUser = ( req: Request, res: Response ) => {
    
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    User.find({ state: true }, 'name email role state')
        .skip(Number(from))
        .limit(Number(limit))        
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ state: true }, (err, count) =>{
                
                if(err) {
                    return res.json({
                        ok: false,
                        count
                    });
                }

               res.json({
                    ok: true,
                    users,
                    count
                });
            });
            
        });
};

// POST: Create user
export const createUser = ( req: Request, res: Response ) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });   

    user.save( (err, userDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }        

        res.json({
            ok: true,
            user: userDB
        });
    });
    
}

// PUT: Update User
export const updateUser = ( req: Request, res: Response ) => {

    let id = req.params.id;
    let body = _.pick(req.body, [
        'name',
        'email',
        'img',
        'role',
        'state'
    ]);

    // find user
    User.findByIdAndUpdate(id,  body, 
        { 
            new: true,
            runValidators: true
        }, 
        (err, userDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }   

        res.json({
            ok: true,
            user: userDB
        });

    });
    
}

// DELETE: Delete user
export const deleteUser = ( req: Request, res: Response ) => {
    
    let id = req.params.id;

    // User.findByIdAndRemove() use for delete record on database.

    // Mark the record as eliminated
    let body = _.pick(req.body, [
        'state'
    ]);

    User.findByIdAndUpdate(id, 
        body,
        { new: true }, 
        (err, userDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }   

        res.json({
            ok: true,
            user: userDB
        });
    });
}
