import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useState } from "react";
import { Message } from "../Message/Message";
import { Progress } from "../Progress/Progress";

export const FileUploads = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_FILE_UPLOAD_UR}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercentage(percentage);
          },
        }
      );
      //Clear percentage
      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage("File Uploaded");
    } catch (err) {
      const errMsg = err.response?.data?.msg || "Server Error";
      setMessage(errMsg);
      setUploadPercentage(0);
    }
  };

  return (
    <Container>
      {message && <Message msg={message} />}
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-4">
          <Form.Label>{filename}</Form.Label>
          <Form.Control type="file" onChange={handleChange} />
        </Form.Group>

        <Progress percentage={uploadPercentage} />

        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="w-100 mt-4"
        >
          Upload
        </Button>
      </form>
      {uploadedFile && (
        <Row className="mt-5">
          <Col md={3}></Col>
          <Col md={6}>
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img
              src={uploadedFile.filePath}
              alt={uploadedFile.fileName}
              style={{ maxWidth: "100%" }}
            />
          </Col>
          <Col md={3}></Col>
        </Row>
      )}
    </Container>
  );
};
