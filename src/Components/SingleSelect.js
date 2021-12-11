import React from 'react';
import Select from 'react-select';
//import './Styleselect.css';

const SingleSelect = ({ errorServices, handleChange, selectedService, options, width,disabled, ...res }) => {
  return (
    <React.Fragment>
      <Select className={width} clearValue value={selectedService} onChange={handleChange} options={options} isDisabled={disabled}{...res} />
    </React.Fragment>
  );
};

export default SingleSelect;