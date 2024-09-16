import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import fs from "fs";

const dirDocs = path.join(path.resolve(), "documents");
const dirOutput = path.join(path.resolve(), "data");

export const injest_docs = async () => {
  if (!fs.existsSync(dirDocs)) {
    fs.mkdirSync(dirDocs);
    console.log(`Directory ${path.basename(dirDocs)} created successfully!`);
  }

  if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput);
    console.log(`Directory ${path.basename(dirOutput)} created successfully!`);
  }

  if (fs.readdirSync(dirDocs).length === 0) {
    console.log(`Directory ${path.basename(dirDocs)} is empty!`);
    return;
  }

  // 5. Initialize the document loader with supported file formats
  const loader = new DirectoryLoader(dirDocs, {
    ".json": (p) => new JSONLoader(p),
    ".txt": (p) => new TextLoader(p),
    ".csv": (p) => new CSVLoader(p),
    ".pdf": (p) => new PDFLoader(p),
  });

  // 6. Load documents from the specified directory
  console.log("Loading docs...");
  const docs = await loader.load();
  console.log("Docs loaded.");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docOutput = await textSplitter.splitDocuments(docs);

  console.log("vectorStore...");
  let vectorStore = await FaissStore.fromDocuments(
    docOutput,
    new OpenAIEmbeddings()
  );
  console.log("saving...");

  await vectorStore.save(dirOutput);
  console.log("saved!");
};

injest_docs();