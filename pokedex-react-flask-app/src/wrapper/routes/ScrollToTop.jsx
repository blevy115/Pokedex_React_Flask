import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { action } = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // Make Back and Forward button act normally
    if (action === "POP") return;

    window.scrollTo(0, 0);
  }, [action, pathname]);
};
export default ScrollToTop;
