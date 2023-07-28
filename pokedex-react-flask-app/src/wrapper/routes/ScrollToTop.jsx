import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { action } = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // Do nothing when using the browser's back/forward buttons
    if (action === "POP") return;

    window.scrollTo(0, 0);
  }, [action, pathname]);
};
export default ScrollToTop;
