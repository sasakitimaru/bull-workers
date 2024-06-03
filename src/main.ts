import express from "express";
import { addJobs } from "./queue";
import { MessageQueueReq } from "./workers/factory";

const app = express();
app.use(express.json());

app.post("/message", async (req, res) => {
  try {
    const { messages }: { messages: MessageQueueReq[] } = req.body;
    const messageArray = Array.isArray(messages) ? messages : [messages];
    await addJobs(messageArray);
    res.status(200).send("Messages are added to the queue");
  } catch (error) {
    console.error("Error adding jobs to the queue:", error);
    res.status(500).send("Failed to add jobs to the queue");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
