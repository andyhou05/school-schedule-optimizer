import { Flex, DataList, Text } from "@radix-ui/themes";
import DataListTemplate from "../../../../../Layout/DataListTemplate";

const ConflictsLayout = ({ courses }) => {
  return (
    <Flex>
      <DataListTemplate list={courses} style={{ width: "100%" }}>
        {(course) => (
          <div>
            <Text
              style={{ width: "100%" }}
            >{`${course.courseId} (sect. ${course.section}):`}</Text>
            <Text ml="4" weight="medium">{`${course.day} ${course.time}`}</Text>
          </div>
        )}
      </DataListTemplate>
    </Flex>
  );
};

export default ConflictsLayout;
