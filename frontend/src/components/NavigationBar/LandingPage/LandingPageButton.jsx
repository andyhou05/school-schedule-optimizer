import React from "react";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router";

const LandingPageButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      mt="7"
      size="4"
      radius="full"
      style={{ width: "50%" }}
      onClick={() => navigate("/form")}
    >
      Start
    </Button>
  );
};

export default LandingPageButton;
