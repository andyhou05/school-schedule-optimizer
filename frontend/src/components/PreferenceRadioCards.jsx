import React, { useContext } from "react";
import { RadioCards, Text } from "@radix-ui/themes";
import { DispatchUserInputContext, ACTIONS } from "./ScheduleForm";

const PreferenceRadioCards = ({
  size,
  gap,
  items,
  API_values, // keys that match API params
  name,
}) => {
  const dispatch = useContext(DispatchUserInputContext);

  const handleChange = (index) => {
    dispatch({
      type: ACTIONS.updatePreferences,
      payload: { updatedPreference: name, value: API_values[index - 1] },
    });
  };

  return (
    <RadioCards.Root
      defaultValue="1"
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
