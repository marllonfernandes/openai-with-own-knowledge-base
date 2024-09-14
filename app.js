import { OpenAI } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";

import express from "express";
import http from "http";
import path from "path";

const app = express();
const port = 3000;

/* Create HTTP server */
http.createServer(app).listen(process.env.PORT);
console.info("listening on port " + process.env.PORT);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/* Get endpoint to check current status  */
app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.get("/question", async (req, res) => {
  try {
    if (!req.query.prompt) {
      return res.json({ error: "No prompt provided" });
    }

    const llmA = new OpenAI({ modelName: "gpt-4o", temperature: 0.9 });
    const chainA = loadQAStuffChain(llmA);
    const directory = path.join(path.resolve(), "data");

    const loadedVectorStore = await FaissStore.load(
      directory,
      new OpenAIEmbeddings()
    );

    const prompt = req.query.prompt || "what is this article about?";
    const result = await loadedVectorStore.similaritySearch(prompt, 3);
    const respChain = await chainA.invoke({
      input_documents: result,
      question: prompt,
    });
    res.json({ result: respChain }); // Send the response as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); // Send an error response
  }
});