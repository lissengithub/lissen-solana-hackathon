"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import Icon from '@/components/ui/icon'
import { useState, useEffect } from "react";

const appDownloadLinks = {
  ios: "https://apps.apple.com/gb/app/lissen/id6444801516",
  android: "https://play.google.com/store/apps/details?id=com.lissen.app",
}

const DownloadAppButton = (props: ButtonProps) => {
  const [link, setLink] = useState(appDownloadLinks.ios); // Default to iOS initially

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) {
      setLink(appDownloadLinks.android);
    }
  }, []);

  return (
    <Button variant="outline" asChild {...props}>
      <a 
        href={link} 
        target="_blank" 
        className="rounded-xl border-black/20 bg-white flex items-center space-x-2 px-2 py-6 dark:hover:bg-gray-200"
      >
        <Icon name="apple" />
        <Icon name="playstore" />
        <div className="w-px h-[20px] bg-gray-300" />
        <span className="font-medium text-sm text-black">Get the UK app</span>
      </a>
    </Button>
  )
}

export default DownloadAppButton;
