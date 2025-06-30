import { Prisma, PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import {z} from "zod";

const testRouter = Router();
const prisma = new PrismaClient();

testRouter.post("/create", async (req : Request, res : Response) => {
  const extractedMail = req.body.email;
  const extractedUsername = req.body.username;
  if(!extractedMail || !extractedUsername) {
    res.status(400).json({
      "msg" : "there's some issue with the inputs"
    });
  }
  else {
    await prisma.user.create({
      data : {
        email : extractedMail,
        username : extractedUsername
      }
    });
    res.status(200).json({ message: `${extractedUsername} is a User now!` });
  }
});

testRouter.get("/all", async (req : Request, res : Response) => {
  try { 
    const users = await prisma.user.findMany()
    return res.status(200).json({
      users
    });
  } catch(err) {
    return res.status(500).json({
      error: (err as Error).message
    });
  }
});

testRouter.get("/:id", async (req : Request, res : Response) => {
  const id = parseInt(req.params.id);
  if(isNaN(id)) {
    return res.status(400).json({
      msg: "Invalid or missing ID" 
    });
  }
  try { 
    const user = await prisma.user.findUnique({
      where: {id}
    })
    
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.status(200).json({user});
  } 
  catch(err) {
    return res.status(500).json({error: (err as Error).message});
  }
});

const usernameSchema = z.object({
  username : z.string().min(3)
})

testRouter.put("/:id", async (req : Request, res : Response) => {
  const safeParsed = usernameSchema.safeParse(req.body);
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "Invalid or missing ID" });
  }

  if(!safeParsed.success) {
    return res.status(400).json({
      msg : "Invalid inputs"
    });
  }
  try {
    const updateUser = await prisma.user.update({
      where : {id},
      data : {username : safeParsed.data.username}
    });
    
    if(!updateUser) return res.status(404).json({msg : "User Not found!"});
    return res.status(200).json({msg : "Username Updated Successfully !"});
  }
  catch(err) {
    res.status(500).json({msg : "Server not Running"});
  }
});

testRouter.delete("/:id", async(req : Request, res : Response) => {
  const id = parseInt(req.params.id);
  if(isNaN(id)) {
    return res.status(400).json({msg: "Bad Request"});
  }
  try {
    await prisma.user.delete({
      where : {
        id
      }
    })
    return res.status(200).json({msg : "User deleted Successfully"});
  } catch (err) {
    res.status(404).json({msg : "User Not Found"})
  }
});

export default testRouter;