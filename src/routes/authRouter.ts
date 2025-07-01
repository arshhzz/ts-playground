import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post("/signup", async(req : Request, res : Response) => {
  const {email , username, password} = req.body;

  try {
    if(!email || !username || !password) {
      return res.status(400).json({msg : "All fields are required"});
    }
    const existingUser = await prisma.user.findUnique({where : {email}});
    if(existingUser) {
      return res.status(400).json({msg : "Email is already registered"});
    }
    
    const hashedpass = await bcrypt.hash(password, 11);
    const user = await prisma.user.create({
      data : {
        email, username, 
        password: hashedpass
      }
    });
    const token = jwt.sign({userId : user.id}, process.env.JWT_SECRET!, {expiresIn: "1h"});
    res.status(201).json({token});
  } catch (err) {
    res.status(500).json({msg : "Server not Found!"});
  }
});

authRouter.post("/login", async(req : Request, res : Response) => {
  const {email, password} = req.body;
  try {
    if(!email || !password) {
      return res.status(400).json({msg : "All the fields are required"});
    }
    const user = await prisma.user.findUnique({
      where : {
        email
      }
    });
    if(!user) {
      return res.status(400).json({msg : "Email not registered"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({msg : "Invalid Credentials"});
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn : "1h"});
    res.status(200).json({token});
  } catch(err) {
    console.log("Login Error : ", err);
    return res.status(500).json({msg : "Sever not Found"});
  }
});


export default authRouter;