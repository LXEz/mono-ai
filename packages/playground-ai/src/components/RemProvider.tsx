"use client";

import { useEffect } from "react";

export default function RemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const calc = () => {
      const maxWidth = 1400; // maximum width
      const minWidth = 900; // minimum width
      const html = document.getElementsByTagName("html")[0];
      const clientWidth = html.clientWidth || document.body.clientWidth;

      // Constrain width between min and max
      const width = Math.min(Math.max(clientWidth, minWidth), maxWidth);

      html.style.fontSize = (width / 1440) * 16 + "px";
    };

    // Initialize
    calc();

    // Add resize listener
    window.addEventListener("resize", calc);

    // Cleanup function
    return () => window.removeEventListener("resize", calc);
  }, []);

  return <>{children}</>;
}
