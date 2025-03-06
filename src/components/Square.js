import React from 'react';
import PropTypes from 'prop-types';

const Square = ({ value }) => {
  return (
    <div className="square">
      {value}
    </div>
  );
};

Square.propTypes = {
  value: PropTypes.string.isRequired
};

export default Square;