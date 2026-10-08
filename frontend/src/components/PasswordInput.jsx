import { useState } from "react";

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "185px",
      }}
    >
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: "185px",
          boxSizing: "border-box",
          paddingRight: "55px",
        }}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "3px",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "2px 5px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "0.8rem",
        }}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default PasswordInput;