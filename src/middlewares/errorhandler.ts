import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler : ErrorRequestHandler = (err : unknown, req : Request, res : Response, next : NextFunction) => {
  if(err instanceof ZodError) {
    res.status(400).json({
      message: "Invalid Inputs"
    });
    return;
  }
  res.status(500).json({
    message : "Server not found"
  });
};

