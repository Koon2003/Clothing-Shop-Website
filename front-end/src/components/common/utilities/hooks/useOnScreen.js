import { useEffect, useState, useRef } from "react";

const useOnScreen = (options) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const currentElement = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      // Update visibility status whenever the intersection status changes
      setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [isIntersecting, ref];
};

export default useOnScreen;
