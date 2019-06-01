import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

// Working with Express()
export const server = () => {
    const app = express();

    if(process.env.NODE_ENV !== 'production') {
        dotenv.config();
    }

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());
    
     app.get('/user', ( req, res ) => {
        
        res.json('get user');
    });
    
    app.post('/user', ( req, res ) => {

        let body = req.body;

        if (body.name === undefined) {
            res.status(400).json({
                ok: false,
                message: 'The name is required'
            });
        } else {
            
            res.json({
                body
            });
        }
        
    });

    app.put('/user/:id', ( req, res ) => {

        let id = req.params.id;
        
        res.json({
            id
        });
    });
    
    app.delete('/user', ( req, res ) => {
        
        res.json('delete user');
    });
    
    

    app.listen(process.env.PORT, () => {
        console.log(`Listening port ${ process.env.PORT }`);
    });
}

server();