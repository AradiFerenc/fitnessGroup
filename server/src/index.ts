import express from 'express';
import {configureRoutes} from "./routes/routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import {configurePassport} from "./passport/passport";
import mongoose from "mongoose";
import {logE, logI} from "./Utils/Log";
import cors from "cors";

const app = express();
const port = 3000;
const dbUrl = 'mongodb://localhost:27017/db';

mongoose.connect(dbUrl).then((data) => {
    logI("Successfully connected to MongoDB");
}).catch((error) => {
    logE(error);
});

const whitelist = ['*', 'http://localhost:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);
app.use('/', configureRoutes(passport, express.Router()));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});