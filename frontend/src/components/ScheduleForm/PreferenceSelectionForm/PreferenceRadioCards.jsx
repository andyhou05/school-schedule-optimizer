import React, { useContext, useEffect } from "react";
import { RadioCards, Text } from "@radix-ui/themes";
import {
  DispatchUserChoicesContext,
  UserChoicesContext,
} from "../../Context/UserChoicesProvider";
import ACTIONS from "../../Context/Reducer/Actions";

const PreferenceRadioCards = ({
  size,
  gap,
  items,
  API_values, // keys that match API params
  name,
}) => {
  const userChoicesDispatch = useContext(DispatchUserChoicesContext);
  const userChoices = useContext(UserChoicesContext);

  const handleChange = (index) => {
    userChoicesDispatch({
      type: ACTIONS.updatePreferences,
      payload: {
        updatedPreference: name,
        value: API_values[index - 1],
        index: index,
      },
    });
  };

  return (
    <RadioCards.Root
      defaultValue={userChoices.preferences[name].input ?? "1"}
      ml="6"
      variant="classic"
      size={size}
      gap={gap}
      columns={{ initial: "1", sm: `${items.length}` }}
      onValueChange={(index) => handleChange(index)}
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
