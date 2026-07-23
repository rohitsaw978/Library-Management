// import { useLayoutEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollToTop() {
//   const { pathname } = useLocation();

//   useLayoutEffect(() => {
//     console.log("Before:", window.scrollY);

//     window.scrollTo(0, 0);

//     requestAnimationFrame(() => {
//       console.log("After:", window.scrollY);
//     });
//   }, [pathname]);

//   return null;
// }