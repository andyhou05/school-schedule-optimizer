import {
  DataList,
  IconButton,
  Flex,
  Dialog,
  Separator,
  Link,
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import DataListTemplate from "../Layout/DataListTemplate";

const TeacherDialog = ({ children, teacher }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Flex direction="column">
          <Dialog.Title style={{ textAlign: "center", flex: "1" }}>
            {teacher.name}: {teacher.avgRating}%
          </Dialog.Title>
          <Separator size="4" mt="2" mb="5"></Separator>
          <Dialog.Description size="5" mb="4">
            Reviews
          </Dialog.Description>
          <DataListTemplate list={teacher.links}>
            {(link) => (
              <Link href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </Link>
            )}
          </DataListTemplate>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TeacherDialog;
