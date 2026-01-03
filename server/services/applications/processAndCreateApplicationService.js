import parsePdfOrTxt from "./parsePdfOrTxtService.js";

export async function processAndCreateApplication(params) {
  console.log("processAndCreateApplication called");
  try {
    const { file, jobId } = params;

    //file: multer's req.file object may include .s3 with url info from saveToS3 middleware

    const filePath = file.path || "";
    // Ideally filePath would be S3 URL if uploaded directly to S3
    const fileType = file.mimetype || "";

    const resumeText = await parsePdfOrTxt(filePath, fileType);

    const application = new Application({
      jobId,
      resumeText,
      // Include any other relevant fields for the application
    });
    return application;
  } catch (error) {
    console.error("Error in processAndCreateApplication:", error);
  }
}
