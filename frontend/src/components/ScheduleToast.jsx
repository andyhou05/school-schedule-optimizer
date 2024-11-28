import React from "react";
import * as Toast from "@radix-ui/react-toast";
import "./styles.css";

const ScheduleToast = ({ title, description, open, onOpenChange }) => {
  return (
    <Toast.Provider duration="2500">
      <Toast.Root className="ToastRoot" open={open} onOpenChange={onOpenChange}>
        <Toast.Title>{title}</Toast.Title>
        <Toast.Description>{description}</Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport"></Toast.Viewport>
    </Toast.Provider>
  );
};

export default ScheduleToast;
