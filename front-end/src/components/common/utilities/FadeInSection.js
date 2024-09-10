import React from "react";
import useOnScreen from "./hooks/useOnScreen";

const FadeInSection = ({ children }) => {
  // Custom hook
  const [isVisible, ref] = useOnScreen({
    root: null, // uses the default viewport
    rootMargin: "0px",
    threshold: 0.1, // trigger when 50% of the target is visible
  });

  // Styles
  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20vh)",
    transition: "opacity 0.6s ease-out, transform 1s ease-out",
    willChange: "opacity, transform", // Hint for browsers to optimize
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export default FadeInSection;
