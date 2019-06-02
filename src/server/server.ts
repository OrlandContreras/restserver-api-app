import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes/index';

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

    // Enabled public folder
    app.use(express.static(path.join(__dirname, '../../dist/public')));
    

    // Load global Routes
    app.use(routes);
 
    // connect to mongoDB
    mongoose.connect(
        urlDB, 
        { 
            useNewUrlParser: true,
            useCreateIndex: true,            
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