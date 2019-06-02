import express from "express";
import appUserRoute from './user';
import { loginRoute } from './login';


const routes = express();

// Routes
routes.use(appUserRoute); // User
routes.use(loginRoute); // Login


export default routes;