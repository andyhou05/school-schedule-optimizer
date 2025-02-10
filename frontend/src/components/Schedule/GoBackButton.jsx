import { IconButton } from "@radix-ui/themes";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { DispatchAnimationContext } from "../Context/AnimationProvider";
import ACTIONS from "../Context/Reducer/Actions";

const GoBackButton = ({ ...props }) => {
  const navigate = useNavigate();
  const dispatchAnimation = useContext(DispatchAnimationContext);
  return (
    <IconButton
      {...props}
      variant="ghost"
      onClick={() => {
        dispatchAnimation({ type: ACTIONS.animationReset });
        navigate("/");
      }}
    >
      <ArrowLeftIcon width="50" height="50"></ArrowLeftIcon>
    </IconButton>
  );
};

export default GoBackButton;
