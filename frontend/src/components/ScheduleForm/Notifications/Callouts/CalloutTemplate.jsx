import React from "react";
import { Callout } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const CalloutTemplate = ({ children, text }) => {
  return (
    <Callout.Root color="red" role="alert">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>{text}</Callout.Text>
      {children}
    </Callout.Root>
  );
};
export default CalloutTemplate;
