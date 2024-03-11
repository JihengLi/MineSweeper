import React, { useState } from "react";

type Option = {
  value: string;
  level: string;
};

type ModeDisplayProps = {
  options: Option[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ModeDisplay: React.FC<ModeDisplayProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <select className="ModeDisplay" value={selectedValue} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.level}
        </option>
      ))}
    </select>
  );
};

export default ModeDisplay;
