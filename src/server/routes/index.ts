import express from "express";
import appUserRoute from './user';
import appLoginRoute from './login';


const routes = express();

// Routes
routes.use(appUserRoute); // User
routes.use(appLoginRoute); // Login

export default routes;