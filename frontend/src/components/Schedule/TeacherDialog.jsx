import { Button, Flex, Box, AlertDialog } from "@radix-ui/themes";

const TeacherDialog = ({ children, teacher }) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content>
        <Flex justify="between">
          <Box style={{ textAlign: "center", flex: "1" }}>
            <AlertDialog.Title>{teacher.name} Ratings</AlertDialog.Title>
          </Box>
          <AlertDialog.Cancel>
            <Button></Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default TeacherDialog;
