import React from "react";
import { RadioCards, Text } from "@radix-ui/themes";

const PreferenceRadioCards = ({ size, gap, items = [] }) => {
  return (
    <RadioCards.Root
      defaultValue="1"
      variant="classic"
      size={size}
      gap={gap}
      columns={{ initial: "1", sm: `${items.length}` }}
    >
      {items.map((item, index) => (
        <RadioCards.Item value={`${index + 1}`}>
          <Text>{item}</Text>
        </RadioCards.Item>
      ))}
    </RadioCards.Root>
  );
};

export default PreferenceRadioCards;
