import React from "react";
import "./ToggleSwitch.css";

type ToggleSwitchProps = {
  isChecked: boolean;
  onToggle: () => void;
  label?: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onToggle, label }) => {
  return (
    <div className="toggle-wrapper">
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
        />
        <span className="slider round"></span>
      </label>

      {/* If a label is passed, show it next to the toggle */}
      {label && (
        <span className="toggle-label" style={{ marginLeft: "10px" }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;
