import React from "react";
import { Text, TextField, Box, Flex, Card, Button } from "@radix-ui/themes";

const ScheduleForm = () => {
  return (
    <form>
      <Box
        width="100%"
        height="100vh"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card>
          <Box
            width="400px"
            style={{
              textAlign: "center",
              margin: "auto",
              marginTop: "50px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Text>Enter Course ID</Text>
            <TextField.Root size="3"></TextField.Root>
          </Box>

          <Box width="1000px" height="600px">
            <Button size="3">Continue</Button>
          </Box>
        </Card>
      </Box>
    </form>
  );
};

export default ScheduleForm;
