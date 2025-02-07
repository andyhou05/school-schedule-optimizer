import React from "react";
import { IconButton } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const InfoButton = React.forwardRef(
  ({ mt = 0, onClick = (e) => e.prevent() }, ref) => {
    return (
      <IconButton
        radius="full"
        color="gray"
        mt={mt}
        variant="ghost"
        size="1"
        onClick={onClick}
        ref={ref}
      >
        <InfoCircledIcon height="20px" width="20px"></InfoCircledIcon>
      </IconButton>
    );
  }
);

export default InfoButton;
