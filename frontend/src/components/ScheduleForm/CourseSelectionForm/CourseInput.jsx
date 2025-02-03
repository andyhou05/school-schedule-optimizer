import React from "react";
import { Text, TextField, Flex } from "@radix-ui/themes";

const CourseInput = ({ input, setInput, onEnter }) => {
  return (
    <Flex width="400px" direction="column" gap="4" m="auto" mt="50px">
      <Text align="center" size="5">
        Enter Course ID
      </Text>
      <TextField.Root
        aria-label="courseInput"
        size="3"
        onKeyDown={onEnter}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. 603-101-MA"
        value={input}
      ></TextField.Root>
    </Flex>
  );
};
export default CourseInput;
