import { Flex, DataList, Text } from "@radix-ui/themes";

const ConflictsLayout = ({ courses }) => {
  return (
    <Flex>
      <DataList.Root orientation="vertical" size="3" style={{ width: "100%" }}>
        {courses.map((course) => {
          return (
            <DataList.Item key={course.id}>
              <DataList.Value key={course.id} style={{ width: "100%" }}>
                <span
                  style={{
                    marginRight: "3%",
                    marginLeft: "2%",
                    alignContent: "center",
                    fontSize: "150%",
                  }}
                >
                  •
                </span>
                <div>
                  <Text
                    style={{ width: "100%" }}
                  >{`${course.courseId} (sect. ${course.section}):`}</Text>
                  <Text
                    ml="4"
                    weight="medium"
                  >{`${course.day} ${course.time}`}</Text>
                </div>
              </DataList.Value>
            </DataList.Item>
          );
        })}
      </DataList.Root>
    </Flex>
  );
};

export default ConflictsLayout;
