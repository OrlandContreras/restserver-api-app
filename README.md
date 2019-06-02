## Rest API Application
This Application was developed with NODE JS and Typescript. It use a database mongoDB locally and it is connect to [mongodb atlas](https://www.mongodb.com/cloud/atlas) as production database.

## .env
You must be create the file .env and configure the variables of environment:

* NODE_ENV=dev
* PORT=3000
* DATABASE_DEV = mongodb://localhost:27017/coffee
* DATABASE_PROD = <YOUR_PROD_DATABASE_STRING_CONNECTION>
 
Expires Token 60 * 60 * 24 * 30
* EXPIRES_TOKEN = 2592000

SEED Token
* SEED_TOKEN_DEV = secret-dev
* SEED_TOKEN_PROD = your_secret_seed

## Database fields - Users Collection
```
    name: string;
    email: string;
    password: string;
    img?: string;
    role?: string;
    state?: string;
    google?: string;
```

## API Rest
This application has implemented the methods GET, POST, PUT and DELETE.

## Udemy - NODE JS
This application is an alternative solution to the solution taught by Professor [Fernando Herrera](https://www.fernando-herrera.com) in the course of [Udemy](https://www.udemy.com/node-de-cero-a-experto/).