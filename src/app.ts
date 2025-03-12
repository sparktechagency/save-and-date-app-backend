import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { Morgan } from "./shared/morgan";
import router from '../src/app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import session, { SessionOptions } from "express-session";
import passport from "./config/passport";
import requestIp from 'request-ip';
import rateLimit from 'express-rate-limit';
import ApiError from "./errors/ApiErrors";
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        if (!req.clientIp) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Unable to determine client IP!');
        }
        return req.clientIp;
    },
    handler: (req, res, next, options) => {
        throw new ApiError(options?.statusCode, `Rate limit exceeded. Try again in ${options.windowMs / 60000} minutes.`);
    }
});

// morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);


//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());
app.use(limiter);

//file retrieve
app.use(express.static('uploads'));

// Session middleware (must be before passport initialization)
const sessionConfig: SessionOptions = {
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
};

app.use(session(sessionConfig) as any);

// Initialize Passport
app.use(passport.initialize() as any);
app.use(passport.session());

//router
app.use('/api/v1', router);

app.get("/", (req: Request, res: Response) => {
    res.send("Hey Backend, How can I assist you ");
})

//global error handle
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API DOESN'T EXIST"
            }
        ]
    })
});

export default app;