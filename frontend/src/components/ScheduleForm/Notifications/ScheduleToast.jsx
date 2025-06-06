import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { Flex, Box } from "@radix-ui/themes";
import "../../styles/styles.css";

const ScheduleToast = ({
  title,
  description,
  open,
  onOpenChange,
  IconComponent,
  color,
}) => {
  return (
    <Toast.Provider duration="2500" swipeDirection="up">
      <Toast.Root className="ToastRoot" open={open} onOpenChange={onOpenChange}>
        <Flex direction="row" gap="4">
          <IconComponent
            className="ToastIcon"
            color={color}
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
