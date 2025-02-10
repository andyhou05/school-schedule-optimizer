import { Flex, Text, Em } from "@radix-ui/themes";
import FormCard from "../Layout/FormCard";
import GoBackButton from "./GoBackButton";

const ScheduleNotFound = () => {
  return (
    <FormCard>
      <Flex justify="center" align="center" direction="column">
        <Text weight="medium" size="8" mb="7">
          <Em>No schedules meet your conditions.</Em>
        </Text>
        <img src="images/schedulenotfound.png"></img>
        <GoBackButton></GoBackButton>
      </Flex>
    </FormCard>
  );
};

export default ScheduleNotFound;
