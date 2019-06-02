import express from "express";
import bcrypt from 'bcrypt';
import _ from 'underscore';
import { User } from '../models/user';
import { verifyToken, verifyAdminRole }  from '../middlewares/authentication';

const appUserRoute = express();

// GET
appUserRoute.get('/user', verifyToken, ( req, res ) => {
    
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
                
                res.json({
                    ok: true,
                    users,
                    count
                });
            });
            
        });
});

// POST
appUserRoute.post('/user', [verifyToken, verifyAdminRole], ( req: any, res: any ) => {

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
    
});

// PUT
appUserRoute.put('/user/:id', [verifyToken, verifyAdminRole], ( req: any, res: any ) => {

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
    
});

// DELETE
appUserRoute.delete('/user/:id', [verifyToken, verifyAdminRole], ( req: any, res: any ) => {
    
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


});

export default appUserRoute;