import multer from "multer";

// Store uploaded resume temporarily in memory
const storage = multer.memoryStorage();

// Allow only PDF and DOCX resumes
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF and DOCX files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  // Maximum resume size = 5 MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;