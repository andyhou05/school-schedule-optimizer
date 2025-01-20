import ACTIONS from "./Actions";

const animationReducer = (animation, action) => {
    switch (action.type) {
      case ACTIONS.animationNext:
        return { step: animation.step + 1, direction: "forward" };
  
      case ACTIONS.animationPrevious:
        return { step: animation.step - 1, direction: "backward" };
    }
  };

export default animationReducer