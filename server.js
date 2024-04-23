const express = require("express");
const fileUpload = require("express-fileupload");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(fileUpload());

app.use(cors());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  // File Streaming
  const file = req.files.file;

  file.mv(`${__dirname}/client/public/files/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res
      .status(200)
      .json({ fileName: file.name, filePath: `/files/uploads/${file.name}` });
  });
});

const PORT = process.env.SERVER_PORT || 4100;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.SERVER_NODE_ENV} mode on port http://localhost:${PORT}`
      .bgBlue.bold.underline
  )
);
