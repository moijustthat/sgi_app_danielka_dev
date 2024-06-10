import React, { useState, useCallback } from "react";
import { Alert } from "@mui/material";
import { debounce } from "lodash";
import { Button } from "@mui/material";

export const DateField = ({
  incomplete = false,
  desactiveManually = false,
  value = "",
  blocked = false,
  label,
  onChange = () => null,
}) => {
  const [err, setErr] = useState("");
  const [warning, setWarning] = useState("");
  return (
    <div className="customDate">
      <label>{label}</label>
      <Alert
        sx={{
          display: err == "" ? "none" : "",
        }}
        severity="error"
      >
        {err}
      </Alert>
      <Alert
        sx={{
          display: warning == "" || desactiveManually ? "none" : "",
        }}
        severity="warning"
      >
        {warning}
      </Alert>
      <input
        className={incomplete ? "markAsIncomplete" : ""}
        value={value}
        onChange={(e) => onChange(e.target.value, setErr, setWarning)}
        id="dateField"
        type="date"
        disabled={blocked}
      ></input>
    </div>
  );
};

export const SelectField = ({
  incomplete = "",
  value = "",
  blocked = false,
  label = "",
  onChange = () => null,
  options = [],
}) => {
  return (
    <div className="customSelect">
      <label>{label}</label>
      <select
        className={incomplete !== "" ? "markAsIncomplete" : ""}
        value={value}
        onChange={(e) => onChange(e.target.value, () => true)}
      >
        <option disabled selected value="empty">
          Seleccionar
        </option>
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="customArrow"></span>
    </div>
  );
};

export const ImgField = ({
  label,
  blocked = false,
  placeholder,
  onChange,
  incomplete = null,
}) => {
  const [err, setErr] = useState("");
  const [warning, setWarning] = useState("");

  return (
    <div className="textField">
      <label>{label}</label>
      <Alert
        sx={{
          display: warning == "" ? "none" : "",
        }}
        severity="warning"
      >
        {warning}
      </Alert>
      <Alert
        sx={{
          display: err == "" ? "none" : "",
        }}
        severity="error"
      >
        {err}
      </Alert>
      <input
        className={incomplete ? "markAsIncomplete" : ""}
        type="file"
        onChange={(e) => {
          onChange(e.target.files[0], setErr, setWarning);
        }}
        placeholder={
          incomplete ? `Rellena el campo ${incomplete}` : placeholder
        }
      />
    </div>
  );
};

export const TextField = React.memo(
  ({
    password = false,
    desactiveManually = false,
    value = "",
    type = "text",
    blocked = false,
    label = "",
    placeholder = "",
    onChange = () => null,
    incomplete = null,
  }) => {
    const [err, setErr] = useState("");
    const [warning, setWarning] = useState("");
    const [dis, setDis] = useState(true)

    const debouncedOnChange = useCallback(
      debounce((value, setErr, setWarning) => {
        onChange(value, setErr, setWarning);
      }, 5),
      [onChange]
    );

    return (
      <div className="textField">
        <label>
          {label}{" "}
          <label
            onClick={()=>setDis(!!!dis)}
            style={{
              display: type === "price" ? "" : "none",
              borderRadius: '5px',
              border: '2px solid #92A4D4',
              padding: '5px 5px',
              cursor: 'pointer',
              background: '#ffffffc7'
            }}
          >
            {dis ? 'Modificar' : 'Bloquear'}
          </label>
        </label>

        <Alert
          onClose={() => setErr("")}
          sx={{
            display: err == "" ? "none" : "",
          }}
          severity="error"
        >
          {err}
        </Alert>
        <Alert
          sx={{
            display: warning == "" || desactiveManually ? "none" : "",
          }}
          severity="warning"
        >
          {warning}
        </Alert>
        <input
          style={{
            background: (type === "price" && dis) || blocked ? '#ffffff5d' : ''
          }}
          className={incomplete ? "markAsIncomplete" : ""}
          value={value}
          disabled={type === "price" ? dis : blocked}
          onChange={(e) => onChange(e.target.value, setErr, setWarning)}
          type={password ? "password" : "text"}
          placeholder={
            incomplete ? `Rellena el campo ${incomplete}` : placeholder
          }
        />
      </div>
    );
  }
);

export const TextArea = React.memo(
  ({
    value = "",
    blocked = false,
    label,
    placeholder,
    onChange = () => null,
    incomplete = null,
  }) => {
    const [err, setErr] = useState("");
    const [warning, setWarning] = useState("");
    const debouncedOnChange = useCallback(
      debounce((value, setErr, setWarning) => {
        onChange(value, setErr, setWarning);
      }, 5),
      [onChange]
    );

    return (
      <div className="textField">
        <label>{label}</label>
        <Alert
          onClose={() => setErr("")}
          sx={{
            display: err == "" ? "none" : "",
          }}
          severity="error"
        >
          {err}
        </Alert>
        <textarea
          className={incomplete ? "markAsIncomplete" : ""}
          value={value}
          onChange={(e) => onChange(e.target.value, setErr, setWarning)}
          placeholder={
            incomplete ? `Rellena el campo ${incomplete}` : placeholder
          }
          rows={4}
          cols={50}
        ></textarea>
      </div>
    );
  }
);
