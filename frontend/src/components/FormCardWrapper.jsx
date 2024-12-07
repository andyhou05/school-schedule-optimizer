import React from "react";
import { Flex, Box, Card } from "@radix-ui/themes";

const FormCard = ({ children, transform }) => {
  return (
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Card
        style={{
          boxShadow: "var(--shadow-4)",
          transform: transform,
          transition: "transform 0.25s ease-in-out",
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
