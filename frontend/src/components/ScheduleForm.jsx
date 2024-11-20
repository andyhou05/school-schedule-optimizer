import React from "react";
import { Text, TextField, Box, Flex, Card, Button } from "@radix-ui/themes";

const ScheduleForm = () => {
  return (
    <form>
      <Flex width="100%" height="100vh" align="center" justify="center">
        <Card style={{ boxShadow: "var(--shadow-4)" }}>
          <Flex width="400px" direction="column" gap="4" m="auto" mt="50px">
            <Text align="center">Enter Course ID</Text>
            <TextField.Root size="3"></TextField.Root>
          </Flex>

          <Box width="1000px" height="600px" position="relative">
            <Box position="absolute" bottom="16px" right="32px">
              <Button size="3">Continue</Button>
            </Box>
          </Box>
        </Card>
      </Flex>
    </form>
  );
};

export default ScheduleForm;
