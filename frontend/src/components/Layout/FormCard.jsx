import React from "react";
import { Flex, Box, Card } from "@radix-ui/themes";

const FormCard = ({ children, step, currentStep, direction }) => {
  const getClassName = () => {
    if (currentStep == 1 && direction == "forward") {
      return "";
    }
    if (direction == "forward" && (step == currentStep || step < currentStep))
      return "card-up";
    if (direction == "backward" && (step == currentStep || step > currentStep))
      return "card-down";
    return "";
  };

  return (
    <Flex height="100vh" align="center" justify="center">
      <Card
        className={getClassName()}
        style={{
          boxShadow: "var(--shadow-4)",
          transition: "transform 0.5s ease-in-out",
          height: "80vh",
        }}
      >
        <Box width="60vw" m="auto" mt="50px">
          {children}
        </Box>
      </Card>
    </Flex>
  );
};

export default FormCard;
