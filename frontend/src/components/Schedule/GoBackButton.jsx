import { DispatchAnimationContext } from "../Context/AnimationProvider";
import ACTIONS from "../Context/Reducer/Actions";
import { Button } from "@radix-ui/themes";
import { useContext } from "react";
import { useNavigate } from "react-router";

const GoBackButton = () => {
  const navigate = useNavigate();
  const dispatchAnimation = useContext(DispatchAnimationContext);
  return (
    <Button
      size="4"
      onClick={() => {
        dispatchAnimation({ type: ACTIONS.animationReset });
        navigate("/");
      }}
    >
      Go Back
    </Button>
  );
};

export default GoBackButton;
