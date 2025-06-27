import { NextFunction, Response, Request} from "express";

function logger (req : Request, res : Response, next : NextFunction) {
  console.log(`Incoming Request ${req.method} ${req.url}`)
  next();
}

export default logger;