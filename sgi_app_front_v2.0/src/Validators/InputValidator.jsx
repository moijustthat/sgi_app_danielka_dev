import React, { useRef, useState, useEffect } from "react";
import "./InputValidator.css";
import Alert from "@mui/joy/Alert";
import icons from "../Icons/IconLibrary";

const { smallError, smallWarning, smallInfo } = icons;

const InputValidator = ({
  children,
  onValidationError = (input) => false,
  errorMessage = "",
  onValidationWarning = (input) => false,
  warningMessage = "",
  restrictions = [{
		onRestriction: (input)=>false,
		message: ""
	}],
}) => {
  const [inputValue, setInputValue] = useState("");
  const [extraClass, setExtraClass] = useState("");
  const [info, setInfo] = useState(null);
  const [block, setBlock] = useState(false);

  const handleInputChange = (event) => {
    for (let restriction of restrictions) {
      if (restriction.onRestriction(event.target.value)) {
        setInputValue(inputValue);
        setInfo(restriction.message);
				return;
      } else {
        setInputValue(event.target.value);
        setInfo(null);
      }
    }
  };

  

  return (
    <div className={`rootInput ${block ? "block" : ""}`}>
      {React.cloneElement(children, {
        value: inputValue,
        onChange: handleInputChange,
      })}
      {onValidationError(inputValue) && (
        <Alert variant="plain" color="danger" startDecorator={smallError}>
          {errorMessage}
        </Alert>
      )}
      {onValidationWarning(inputValue) && (
        <Alert variant="plain" color="danger" startDecorator={smallWarning}>
          {warningMessage}
        </Alert>
      )}
      {info && (
        <Alert variant="plain" color="neutral" startDecorator={smallInfo}>
          {info}
        </Alert>
      )}
    </div>
  );
};

export default InputValidator;
