import React from "react";
import { Flex, Box, Card } from "@radix-ui/themes";

const FormCard = ({ children, className }) => {
  return (
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Card
        className={className}
        style={{
          boxShadow: "var(--shadow-4)",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        <Box width="125vh" m="auto" mt="50px">
          {children}
        </Box>
      </Card>
    </Flex>
  );
};

export default FormCard;
