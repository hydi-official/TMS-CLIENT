import { useEffect } from "react";

const useScrollToTop = () => {
  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling
      });
    };

    handleScrollToTop(); // Call the scroll function when the component mounts
  }, []); // Empty dependency array ensures it runs only once on mount
};

export default useScrollToTop;