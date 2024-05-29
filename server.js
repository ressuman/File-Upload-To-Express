// const express = require("express");
// const fileUpload = require("express-fileupload");
// const colors = require("colors");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();

// const app = express();

// app.use(fileUpload());

// app.use(cors());

// // Upload Endpoint
// app.post("/upload", (req, res) => {
//   if (req.files === null) {
//     return res.status(400).json({ msg: "No file uploaded" });
//   }
//   // File Streaming
//   const file = req.files.file;

//   file.mv(`${__dirname}/client/public/files/uploads/${file.name}`, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }

//     res
//       .status(200)
//       .json({ fileName: file.name, filePath: `/files/uploads/${file.name}` });
//   });
// });

// const PORT = process.env.SERVER_PORT || 4100;

// app.listen(
//   PORT,
//   console.log(
//     `Server running in ${process.env.SERVER_NODE_ENV} mode on port http://localhost:${PORT}`
//       .bgBlue.bold.underline
//   )
// );

const express = require("express");
const fileUpload = require("express-fileupload");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(fileUpload({ createParentPath: true })); // Enable file upload with parent directory creation

// Configure CORS with more control for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*", // Restrict to specific origin in production
  methods: ["GET", "POST"], // Allow only specific HTTP methods
  allowedHeaders: ["Content-Type"], // Allow only specific headers
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

// Middleware for logging requests in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Upload Endpoint
app.post(`${process.env.SERVER_URL}/upload`, (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // File Streaming
    const file = req.files.file;

    // Define upload path
    const uploadPath = path.join(
      __dirname,
      "client/public/files/uploads",
      file.name
    );

    // Move file to upload directory
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res
        .status(200)
        .json({ fileName: file.name, filePath: `/files/uploads/${file.name}` });
    });
  } catch (err) {
    next(err); // Pass errors to the error handling middleware
  }
});

// Route to get all uploaded files
app.get(`${process.env.SERVER_URL}/files`, (req, res, next) => {
  try {
    const directoryPath = path.join(__dirname, "client/public/files/uploads");

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.status(200).json({ files });
    });
  } catch (err) {
    next(err); // Pass errors to the error handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "An internal server error occurred." });
});

const PORT = process.env.SERVER_PORT || 4100;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.SERVER_NODE_ENV} mode on port http://localhost:${PORT}`
      .bgBlue.bold.underline
  );
});
