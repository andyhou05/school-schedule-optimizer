import { Dialog } from "@radix-ui/themes";

const ConflictsDialog = ({ children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Conflicts</Dialog.Title>
        <Dialog.Description>
          There are time conflicts with the following courses:
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConflictsDialog;
