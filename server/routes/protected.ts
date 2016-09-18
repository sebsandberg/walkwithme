import { Router, Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../config";
// import { WalkPaths } from "../models/walk-paths";
var walkPaths = require('../models/walk-paths');

const protectedRouter: Router = Router();
// const walkPaths: WalkPaths = WalkPaths();

protectedRouter.use((request: Request & { headers: { authorization: string } }, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;

    verify(token, secret, function(tokenError) {
        // TODO: uncomment this and get auth token working
        // if (tokenError) {
        //     return response.status(403).json({
        //         message: "Invalid token, please Log in first"
        //     });
        // }

        next();
    });
});

protectedRouter.get("/", (request: Request, response: Response) => {
    response.json({
        text: "Greetings, you have valid token.",
        title: "Protected call"
    });
});

protectedRouter.post("/new-walk-path", (request: Request, response: Response) => {
    walkPaths.newWalkPath(request.body, function(err, result) {
        if (err) {
            console.log('protected.ts - newWalkPath POST - error ' + err);
            response.json({success: false, err: err});
        } else {
            response.json({
                success: result
            });
        }
    });
});

protectedRouter.get("/get-walk-paths", (request: Request, response: Response) => {
    walkPaths.getWalkPaths(function(err, result) {
        console.log("hihi")
        if (err) {
            console.log('protected.ts - getWalkPaths GET - error ' + err);
            response.json({ err: err });
        } else {
            console.log(JSON.stringify(result));
            response.json(result);
        }
    });
});

export { protectedRouter }





