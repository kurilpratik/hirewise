import fs from "fs";

/**
 * Parses a PDF or text file and returns the content with formatting preserved.
 * @param {string} filePath - The path to the PDF or text file.
 * @param {string} fileType - The type of file ('pdf' or 'txt').
 * @returns {Promise<string>} - A promise that resolves to the parsed text content.
 */
async function parsePdfOrTxt(filePath, fileType) {
  try {
    console.log(`Parsing file at ${filePath} as type ${fileType}`);
    if (fileType === "application/pdf" || fileType === "pdf") {
      try {
        // dynamically import and get default export (pdfParse is a function)
        const { default: pdfParse } = await import("pdf-parse");
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        console.log("Parsed PDF text length:", pdfData.text.length);
        return pdfData.text;
      } catch (error) {
        throw new Error(`Failed to parse PDF file: ${error.message}`);
      }
    } else if (fileType === "txt") {
      try {
        const txtData = fs.readFileSync(filePath, "utf-8");
        console.log("Parsed TXT text length:", txtData.length);
        return txtData;
      } catch (error) {
        throw new Error(`Failed to read TXT file: ${error.message}`);
      }
    } else {
      throw new Error(
        "Unsupported file format. Only PDF and TXT files are supported.",
      );
    }
  } catch (error) {
    console.error("Error in parsePdfOrTxt:", error.message);
    throw error;
  }
}

export default parsePdfOrTxt;
