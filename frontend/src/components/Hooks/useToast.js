import { useState, useRef } from "react";

const useToast = () => {
  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  const timerRef = useRef(0);
  const lastToastMessage = useRef("");
  const lastToastType = useRef("");

  const showToast = (type, input = "") => {
    setToast({ open: false, type: lastToastType.current, message: lastToastMessage.current });
    clearTimeout(timerRef.current);
    
    setTimeout(() => {
      lastToastType.current = type;
      switch (type) {
        case "add":
          lastToastMessage.current = `${input} has been added`;
          break;
        case "delete":
          lastToastMessage.current = `${input} has been deleted`;
          break;
        case "duplicate":
          lastToastMessage.current = `${input} is already added`;
          break;
        case "invalid":
          lastToastMessage.current = "Invalid course code, try again";
          break;
      }
      setToast({ open: true, type, message: lastToastMessage.current });
    }, 50);
  };

  return { toast, setToast, showToast };
};

export default useToast;
