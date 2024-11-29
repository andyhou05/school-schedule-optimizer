import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { Flex, Box } from "@radix-ui/themes";
import "./styles.css";

const ScheduleToast = ({
  title,
  description,
  open,
  onOpenChange,
  IconComponent,
}) => {
  return (
    <Toast.Provider duration="2500">
      <Toast.Root className="ToastRoot" open={open} onOpenChange={onOpenChange}>
        <Flex direction="row" gap="4">
          <IconComponent
            className="ToastIcon"
            color="lightgreen"
            height="24px"
            width="24px"
          ></IconComponent>
          <Box className="ToastText">
            <Toast.Title>{title}</Toast.Title>
            <Toast.Description>{description}</Toast.Description>
          </Box>
        </Flex>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport"></Toast.Viewport>
    </Toast.Provider>
  );
};

export default ScheduleToast;
