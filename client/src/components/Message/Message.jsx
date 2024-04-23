import PropTypes from "prop-types";
import Alert from "react-bootstrap/Alert";

export const Message = ({ msg }) => {
  return (
    <Alert variant="primary" onClose={() => {}} dismissible>
      <Alert.Heading>{msg}</Alert.Heading>
    </Alert>
  );
};

Message.propTypes = {
  msg: PropTypes.string.isRequired,
};
