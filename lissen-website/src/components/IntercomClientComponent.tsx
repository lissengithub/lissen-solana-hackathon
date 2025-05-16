'use client';

import React, { useEffect } from "react";
import Script from "next/script";
import { isProdEnv } from "@/lib/utils";

declare global {
  interface Window {
    Intercom?: any;
  }
}

const INTERCOM_APP_ID = "e69n91rm";

const IntercomClientComponent: React.FC = () => {
  useEffect(() => {
    if (!isProdEnv()) return;

    if (window.Intercom) {
      window.Intercom('reattach_activator');
      window.Intercom('update', {
        api_base: "https://api-iam.intercom.io",
        app_id: INTERCOM_APP_ID
      });
    }
  }, []);

  if (!isProdEnv()) return null;

  return (
    <Script
      id="intercom-script"
      strategy="lazyOnload"
      src={`https://widget.intercom.io/widget/${INTERCOM_APP_ID}`}
      onLoad={() => {
        window.Intercom?.('update', {
          api_base: "https://api-iam.intercom.io",
          app_id: INTERCOM_APP_ID
        });
      }}
    />
  );
};

export default IntercomClientComponent;
