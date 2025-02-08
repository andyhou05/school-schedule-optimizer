import { useContext } from "react";
import { Flex, DataList, Separator } from "@radix-ui/themes";
import { Dialog } from "@radix-ui/themes";

import ConflictsLayout from "./ConflictsLayout";
import { ConflictsContext } from "../../../../../Context/ConflictsProvider";

const ConflictsDialog = ({ children }) => {
  const conflicts = useContext(ConflictsContext);
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content size="4">
        <Dialog.Title>Conflicts</Dialog.Title>
        <Dialog.Description mb="5">
          There are time overlaps with the following courses:
        </Dialog.Description>

        <Flex direction="column">
          <DataList.Root orientation="vertical" size="3">
            {conflicts.conflicts.map((courses, index) => {
              return (
                <div key={index}>
                  {index == 0 && <Separator size="4" mb="4"></Separator>}
                  <ConflictsLayout courses={courses}></ConflictsLayout>
                  <Separator size="4" mt="4"></Separator>
                </div>
              );
            })}
          </DataList.Root>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConflictsDialog;
