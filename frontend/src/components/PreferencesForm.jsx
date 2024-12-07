import React from "react";
import { Text, Flex } from "@radix-ui/themes";
import FormCardWrapper from "./FormCard";

const PreferencesForm = ({ step, setStep }) => {
  return (
    <>
      <FormCardWrapper className={step == 2 ? "card-up" : ""}>
        <Flex height="60vh"></Flex>
      </FormCardWrapper>
    </>
  );
};

export default PreferencesForm;
