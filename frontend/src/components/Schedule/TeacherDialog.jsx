import {
  DataList,
  IconButton,
  Flex,
  Box,
  AlertDialog,
  Separator,
  Link,
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

const TeacherDialog = ({ children, teacher }) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content>
        <Flex direction="column">
          <AlertDialog.Title style={{ textAlign: "center", flex: "1" }}>
            {teacher.name}: {teacher.avgRating}%
          </AlertDialog.Title>
          <Separator size="4" mt="2" mb="5"></Separator>
          <AlertDialog.Cancel
            style={{ position: "absolute", top: "10%", right: "3%" }}
          >
            <IconButton size="2" variant="outline" color="red">
              <Cross1Icon></Cross1Icon>
            </IconButton>
          </AlertDialog.Cancel>
          <AlertDialog.Description size="5" mb="4">
            Reviews
          </AlertDialog.Description>
          <DataList.Root orientation="horizontal" size="3">
            {teacher.links.map((link, index) => {
              return (
                <DataList.Item key={index}>
                  <DataList.Value key={index}>
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
                    <Link href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </Link>
                  </DataList.Value>
                </DataList.Item>
              );
            })}
          </DataList.Root>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default TeacherDialog;
