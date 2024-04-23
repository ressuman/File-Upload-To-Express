import "./App.css";
import Container from "react-bootstrap/Container";
import { FaReact } from "react-icons/fa6";
import { FileUploads } from "./components/FileUploads/FileUploads";

function App() {
  return (
    <Container className="mt-4">
      <h4 className="text-center display-4 mb-4">
        <FaReact />
        &nbsp; React File Upload
      </h4>

      <FileUploads />
    </Container>
  );
}

export default App;
