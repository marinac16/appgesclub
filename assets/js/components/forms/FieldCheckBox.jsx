import React from 'react';



const Field = ({name, label, value, onChange, type = "text", error = ""}) => (
  <div className="form-group">
    <div>
      <label htmlFor={name} className="mr-5 form-check-label">
      <input
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        id={name}
        className={"mt-n2 form-control form-check-input" + (error && " is-invalid")}/>
      {error && <p className="text-danger">{error}</p>}
      {label}</label>
    </div>
  </div>
);

export default Field;
