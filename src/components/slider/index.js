import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";


function valuetext(value) {
  return `${value}°C`;
}

export default function MinimumDistanceSlider({
  selectedRow = { startAngle: 0, endAngle: 0, innerRadius: 0, outerRadius: 0 },
  onChangeAngle,
}) {
  const defaultRow = {
    startAngle: 0,
    endAngle: 0,
    innerRadius: 0,
    outerRadius: 0,
  };
  const [value1, setValue1] = useState([
    selectedRow.startAngle,
    selectedRow.endAngle,
  ]);
  const [value2, setValue2] = useState([
    Math.trunc(selectedRow.innerRadius * 100),
    Math.trunc(selectedRow.outerRadius * 100),
  ]);
  const [updatedSection, setUpdateSection] = useState(selectedRow);

  useEffect(() => {
    setValue1([selectedRow.startAngle, selectedRow.endAngle]);
    setValue2([
      Math.trunc(selectedRow.innerRadius * 100),
      Math.trunc(selectedRow.outerRadius * 100),
    ]);
  }, [selectedRow]);

  const handleChange1 = (event, newValue) => {
    console.log("change1", updatedSection);
    setValue1(newValue);
    const newSection = {
      ...updatedSection,
      startAngle: newValue[0],
      endAngle: newValue[1],
    };
    setUpdateSection(newSection);
    // selectedRow.startAngle=newValue[0]
    // selectedRow.endAngle=newValue[1]
    onChangeAngle(updatedSection);
  };

  const handleChange2 = (event, newValue) => {
    console.log("change2", updatedSection);
    setValue2(newValue);
    const newSection = {
      ...updatedSection,
      innerRadius: newValue[0] / 100,
      outerRadius: newValue[1] / 100,
    };
    setUpdateSection(newSection);
    // selectedRow.innerRadius=newValue[0] / 100
    // selectedRow.outerRadius=newValue[1] / 100
    onChangeAngle(updatedSection);
  };

  return (
    <Box sx={{ width: 600 }}>
     <div style={{color:"whitesmoke"}}>
        Angle
      </div>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={value1}
        onChange={handleChange1}
        getAriaValueText={valuetext}
        min={0}
        max={360}
        size="small"
        valueLabelDisplay="on"
        disabled={selectedRow === defaultRow}
      />
      <br />
      <br />
      <div style={{color:"whitesmoke"}}>
        Radius
      </div>
      <Slider
        getAriaLabel={() => "Minimum distance shift"}
        value={value2}
        onChange={handleChange2}
        getAriaValueText={valuetext}
        min={0}
        max={100}
        size="small"
        valueLabelDisplay="on"
        disabled={selectedRow === defaultRow}
      />
    </Box>
  );
}
