import React, { useState } from "react";
import { RadioCards, Text } from "@radix-ui/themes";

const PreferenceRadioCards = ({ size, gap, items = [], setSelectedValue }) => {
  return (
    <RadioCards.Root
      defaultValue="1"
      ml="6"
      variant="classic"
      size={size}
      gap={gap}
      columns={{ initial: "1", sm: `${items.length}` }}
      onValueChange={(value) => setSelectedValue(value)}
    >
      {items.map((item, index) => (
        <RadioCards.Item value={`${index + 1}`} key={index}>
          <Text>{item}</Text>
        </RadioCards.Item>
      ))}
    </RadioCards.Root>
  );
};

export default PreferenceRadioCards;
