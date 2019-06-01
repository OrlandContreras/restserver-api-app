import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import appUserRoute from './routes/user';

// Working with Express()
export const server = () => {
    const app = express();
    let urlDB: string;

    dotenv.config();

    if (process.env.NODE_ENV === 'dev') {
        urlDB = <string>process.env.DATABASE_DEV;
    }else {
        urlDB = <string>process.env.DATABASE_PROD;
    }

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());

    // Routes
    app.use(appUserRoute); // User
    

    
    // connect to mongoDB
    mongoose.connect(
        urlDB, 
        { 
            useNewUrlParser: true,
            useCreateIndex: true
        },
        (err) => {
    
            if (err) {
                throw err;
            }

            console.log('Database online!');
    
    });

    app.listen(process.env.PORT, () => {
        console.log(`Listening port ${ process.env.PORT }`);
    });
}

server();