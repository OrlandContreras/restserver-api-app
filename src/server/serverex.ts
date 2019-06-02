import express from "express";
import bodyParser from "body-parser";
import { config } from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes/index';

class Serverex {

    private readonly SERVER_STARTED = 'Server started on port:';
    private app = express();
    private urlDB: string = "";

    constructor() {

        this.configEnv(); 

        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // parse application/json
        this.app.use(bodyParser.json());

        // Enabled public folder
        this.app.use(express.static(path.join(__dirname, '../../dist/public')));
        
        // Load global Routes
        this.app.use(routes);

        this.connectToMongoDB();
    }

    // Load config enviroment
    private configEnv(): void {
        
        config({ path: path.resolve(__dirname, "../../.env")});

        if (process.env.NODE_ENV === 'dev') {
            this.urlDB = <string>process.env.DATABASE_DEV;
        }else {
            this.urlDB = <string>process.env.DATABASE_PROD;
        }
    }

    // Connectio to MongoDB
    private connectToMongoDB(): void {
        mongoose.connect(
            this.urlDB, 
            { 
                useNewUrlParser: true,
                useCreateIndex: true,            
            },
            (err: any) => {
        
                if (err) {
                    throw err;
                }
    
                console.log('Database online!');        
        });
    }

    public start(): void {                      
        this.app.listen(Number(process.env.PORT), () => {
            console.log(`${ this.SERVER_STARTED } ${ process.env.PORT }`);
        });
    }
}

const server :Serverex = new Serverex();
server.start();