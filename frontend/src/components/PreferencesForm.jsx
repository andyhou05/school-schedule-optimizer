import React from "react";
import { Text, Flex } from "@radix-ui/themes";
import FormCardWrapper from "./FormCard";

const PreferencesForm = ({ step, setStep }) => {
  return (
    <>
      <FormCardWrapper transform={step == 2 ? "translateY(-100vh)" : ""}>
        <Flex height="60vh"></Flex>
      </FormCardWrapper>
    </>
  );
};

export default PreferencesForm;
