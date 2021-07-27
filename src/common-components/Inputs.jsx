import React from "react";
import PropTypes from "prop-types";

export const DropDown = (props) => {
  return (
    <div className={props.className}>
      <label className={`${props.className}-label`}>{`${props.label}: `}</label>
      <select
        className={`${props.className}-selections`}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      >
        {props.optionArray.map((val, idx) => {
          return (
            <option
              value={props.valueFunc ? props.valueFunc(val) : val}
              className={`${props.className}-option`}
              key={idx}
            >
              {props.displayFunc ? props.displayFunc(val) : val}
            </option>
          );
        })}
      </select>
    </div>
  );
};

DropDown.propTypes = {
  className: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  optionArray: PropTypes.array.isRequired,
  valueFunc: PropTypes.func,
  displayFunc: PropTypes.func,
  value: PropTypes.any,
  disabled: PropTypes.bool,
};

export const InputField = (props) => {
  return (
    <div className={props.className}>
      <label className={`${props.className}-label`}>{`${props.label}: `}</label>
      <input
        className={`${props.className}-input`}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        type={props.type}
        checked={props.checked}
        disabled={props.disabled}
      >
        {props.name}
      </input>
    </div>
  );
};

InputField.propTypes = {
  className: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};
