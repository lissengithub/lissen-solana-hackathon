"use client";
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const isProd = process.env.NEXT_PUBLIC_PROJECT_ID === "lissenprod";

export const FacebookPixelEvents: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isProd && window) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init("448473844612853");
          ReactPixel.pageView();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [pathname, searchParams]);

  return null;
};
