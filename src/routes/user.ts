import { Request, Response, Router } from "express";
import { userPayload, userSchema } from "../types/user";


const userrouter = Router();

  userrouter.post("/user", (req : Request <{}, {}, userPayload> , res : Response) => {
    const safeParsed = userSchema.safeParse(req.body);
    if(!safeParsed.success) {
      return res.status(400).json({
      error: safeParsed.error.format()
      });
    }
    const { username } = safeParsed.data;

    console.log("User Created : ", safeParsed.data);
    res.json({
      "user": username,
      "status": "created"
    });
  });

  export default userrouter;