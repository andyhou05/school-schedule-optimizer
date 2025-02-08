import React from "react";
import { Callout, Flex } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const CalloutTemplate = ({ children, text }) => {
  return (
    <Callout.Root color="red" role="alert" style={{ width: "92%" }}>
      <Flex direction="row" gap="3">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>{text}</Callout.Text>
        {children}
      </Flex>
    </Callout.Root>
  );
};
export default CalloutTemplate;
