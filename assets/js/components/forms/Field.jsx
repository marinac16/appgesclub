import React from 'react';


const Field = ({name, label, value, onChange, placeHolder="", type = "text", error = ""}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeHolder || label}
        name={name}
        id={name}
        className={"form-control" + (error && " is-invalid")}/>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );

export default Field;
