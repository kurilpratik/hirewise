import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
//document
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import Application from "../../models/application.model.js";

export async function processAndCreateApplication(params) {
  console.log("processAndCreateApplication called");
  try {
    const { file, jobId } = params;

    //file: multer's req.file object may include .s3 with url info from saveToS3 middleware

    const filePath = file.path || "";
    // Ideally filePath would be S3 URL if uploaded directly to S3
    const fileType = file.mimetype || "";

    // Load the PDF file into langchain document
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    //console.log("Loaded documents:", docs);

    const docsText = docs.map((doc) => doc.pageContent).join("\n");
    const resumeText = JSON.stringify(docsText);

    // Sending details processed from resume to controller to actually create Application document in MongoDB
    const application = {
      jobId,
      docsText, // Used for vector store
      resumeText, // Used for analyzing by AI
      // Include any other relevant fields for the application
    };
    return application;
  } catch (error) {
    console.error("Error in processAndCreateApplication:", error);
  }
}
