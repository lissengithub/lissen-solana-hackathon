"use client";

import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import Roster from "./Roster";
import ArtistsList from "@/components/fml/ArtistsList";
import { useManageRosterSheet } from "./useManageRosterSheet";
import { useManageRoster } from "@/hooks/fml/useManageRoster";
import { X } from "lucide-react";
import EligibleGamesList from "./EligibleGamesList";
import { useEffect, useState } from "react";

export { useManageRosterSheet };

export default function ManageRosterSheet() {
  const { isOpen, closeManageRoster, leagueId } = useManageRosterSheet();
  const { addArtist } = useManageRoster(leagueId ?? "");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Check if we're on mobile and if the viewport height is significantly smaller than window height
      // This is a common indicator that the keyboard is shown
      const isMobile = window.innerWidth <= 768;
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const heightDifference = window.innerHeight - viewportHeight;

      setKeyboardVisible(isMobile && heightDifference > 100);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  if (!leagueId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeManageRoster()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-screen-lg lg:max-w-screen-xl rounded-l-xl p-0 overflow-hidden flex flex-col"
        hideCloseButton
      >
        <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_0.5fr] gap-6 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 mt-5 md:mt-10">
            <Roster leagueId={leagueId} keyboardVisible={keyboardVisible} />
            <div className="overflow-y-auto">
              <ArtistsList
                setSelectedArtist={addArtist}
                leagueId={leagueId}
                keyboardVisible={keyboardVisible}
              />
            </div>
          </div>
          <div>
            <EligibleGamesList
              leagueId={leagueId}
              className="hidden md:grid mt-5 md:mt-10"
            />
          </div>
        </div>
        <SheetClose className="hover:bg-neutral-800 rounded-full top-5 right-5 absolute z-50">
          <X size={24} />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
