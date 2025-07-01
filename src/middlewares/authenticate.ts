import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req : Request, res : Response, next : NextFunction) => {
  const authHeader = req.headers.authorization;

  if(!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization token missing" });
  };

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId : number};
    req.user = {userId : decoded.userId};
    next();
  } catch (err) {
    return res.status(403).json({msg : "Invalid or Expired token"});
  }
} 