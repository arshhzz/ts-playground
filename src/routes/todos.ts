import { Router, Request, Response } from "express";
import { todoSchema } from "../types/todo";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient;
const todoRouter = Router();

todoRouter.post("/create", async(req : Request, res : Response) => {
  const safeParsed = todoSchema.safeParse(req.body)
  if(!safeParsed.success) {
    return res.status(400).json({msg : "Invalid Inputs"});
  }
  try {
    const createTodo = await prisma.todo.create({
      data : {
        title : safeParsed.data.title,
        description: safeParsed.data.description,
        done: false,
        userId: safeParsed.data.userId
      }
    })
    return res.status(201).json({msg : "Todo Created Successfully", todo : createTodo});
  }
  catch(err) {
    console.log("Todo Creation error: ", err);
    return res.status(500).json({msg : "Something went Wrong!"});
  }

});

todoRouter.get("/:id", async(req : Request, res : Response) => {
  const userId = parseInt(req.params.id);
  if(isNaN(userId)) {
    return res.status(400).json({msg : "Bad Request"});
  }
  try {
    const todos = await prisma.todo.findMany({
      where : {
        userId
      }
    })
    if(!todos || todos.length === 0) {
      return res.status(404).json({msg : "Todos Not Found!"});
    }
    return res.status(200).json({"Todos" : todos});
  }
  catch(err) {
    console.log("Fetching todos error : ", err);
    return res.status(500).json({msg : "Server Not Found!"})
  }
});

todoRouter.put("/:id", async(req : Request, res : Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
try {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { done: !todo.done },
    });

    res.status(200).json(updatedTodo);
  } catch (err) {
    console.error("Error toggling todo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
todoRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    await prisma.todo.delete({ where: { id } });
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(404).json({ error: "Todo not found" });
  }
});

todoRouter.get("/", async (req, res) => {
  const done = req.query.done;
  const where = typeof done !== "undefined" ? { done: done === "true" } : {};
  const todos = await prisma.todo.findMany({ where });
  res.json(todos);
});

export default todoRouter;