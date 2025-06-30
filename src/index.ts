import express  from "express";
import { Request, Response, NextFunction } from "express";
import logger from "./middlewares/logger";
import echorouter from "./routes/echo";
import userrouter from "./routes/user";
import { errorHandler } from "./middlewares/errorhandler";
import testRouter from "./db/client";

const app = express();
app.use(express.json());
app.use(logger);
const PORT = 3000;

app.get("/api/greet", (req: Request, res: Response) => {
  if (req.query.name) {
    res.json({
      msg: `Hello ${req.query.name}`
    });
    return;
  }

  res.json({
    msg: "Hello guest!"
  });
});
app.use("/api", echorouter);
app.use("/api", userrouter);
app.use("/api/user", testRouter); 

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on the port " + PORT)
});
