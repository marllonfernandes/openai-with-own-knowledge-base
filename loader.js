import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

const dirDocs = path.join(path.resolve(), "./documents");

export const injest_docs = async () => {
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

  const directory = path.join(path.resolve(), "data");
  await vectorStore.save(directory);
  console.log("saved!");
};

injest_docs();