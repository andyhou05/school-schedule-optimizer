import { Flex, Dialog, Separator, Link } from "@radix-ui/themes";
import DataListTemplate from "../Layout/DataListTemplate";

const TeacherDialog = ({ children, teacher }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Flex direction="column">
          <Dialog.Title style={{ textAlign: "center", flex: "1" }}>
            {teacher.avgRating
              ? `${teacher.name}: ${teacher.avgRating}%`
              : `${teacher.name}: N/A`}
          </Dialog.Title>
          <Separator size="4" mt="2" mb="5"></Separator>
          <Dialog.Description size="5" mb="4">
            {teacher.avgRating ? "Reviews" : "No Reviews"}
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
