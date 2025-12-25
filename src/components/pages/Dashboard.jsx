import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const widgets = [
  {
    label: "Regex Builder",
    url: "regex-builder",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      {widgets.map((widget) => {
        return (
          <Button variant="contained" color="primary" disableRipple disableElevation onClick={() => navigate(widget.url)}>{widget.label}</Button>
        );
      })}
    </div>
  );
}

export default Dashboard;
