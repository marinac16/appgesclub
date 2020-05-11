import React from 'react';


const Field = ({name, label, value, list, onChange, placeholder="", multiple,  type = "text", error = ""}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        multiple={multiple}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        list={list}
        className={"form-control" + (error && " is-invalid")}/>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );

export default Field;
