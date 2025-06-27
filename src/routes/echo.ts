import { Request, Response, Router } from "express";
import { echoReqBody } from "../types/echo";

const echorouter = Router();
  
  echorouter.post("/echo", (req : Request<{}, {}, echoReqBody>,  res : Response) => {
    const msg = req.body.message;
    res.json({
      echo : msg
    });
  });

  export default echorouter;