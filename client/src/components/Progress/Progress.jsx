import PropTypes from "prop-types";
import ProgressBar from "react-bootstrap/ProgressBar";

export const Progress = ({ percentage }) => {
  return (
    <div className="text-center">
      <ProgressBar
        striped
        animated
        variant="success"
        now={percentage}
        label={`${percentage}%`}
      />
      {percentage}%
    </div>
  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired,
};
