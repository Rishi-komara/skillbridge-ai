import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("Resume file is required");
  }

  // PDF
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  // DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value.trim();
  }

  throw new Error("Unsupported resume file format");
};

export default extractResumeText;