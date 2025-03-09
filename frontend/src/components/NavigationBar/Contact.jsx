import React from "react";
import { Flex, Text, Strong, IconButton } from "@radix-ui/themes";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

const Contact = () => {
  return (
    <Flex
      position="absolute"
      width="100vw"
      height="90vh"
      direction="column"
      gap="9"
      style={{ left: "7%", marginTop: "5%" }}
    >
      <Text size="7">
        Feel free to reach out if you have any questions, suggestions, or just
        want to say hi!
        <br></br>
        <br></br>
        <Strong>{"Email: "}</Strong>
        andy.hou1604@gmail.com
      </Text>
      <Flex direction="row" gap="9">
        <IconButton
          size="4"
          variant="ghost"
          onClick={() => window.open("https://github.com/andyhou05")}
        >
          <GitHubLogoIcon width="5rem" height="5rem"></GitHubLogoIcon>
        </IconButton>
        <IconButton
          size="4"
          variant="ghost"
          onClick={() =>
            window.open("https://www.linkedin.com/in/andy-hou-3bb8452ba/")
          }
        >
          <LinkedInLogoIcon width="5rem" height="5rem"></LinkedInLogoIcon>
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default Contact;
