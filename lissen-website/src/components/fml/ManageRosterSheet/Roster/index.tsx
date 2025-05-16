"use client";

import { cn } from "@/lib/utils";
import { useManageRoster } from "@/hooks/fml/useManageRoster";
import { SlotEmpty } from "./SlotEmpty";
import { SlotFilled } from "./SlotFilled";
import { useAuth } from "@/lib/firebase/auth-context";
import { useLoginModal } from "@/components/LoginModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useCallback, useMemo, useState } from "react";
import { isTodayMonday } from "@/utils/dates";
import { Button } from "@/components/ui/button";
import { MAX_ROSTER_SIZE } from "@/constants/fml";

interface RosterProps {
  leagueId: string;
  className?: string;
  keyboardVisible: boolean;
}

export default function Roster({
  leagueId,
  className,
  keyboardVisible,
}: RosterProps) {
  const { currentRoster, canSave, saveRoster, savedRoster, toggleAddRemove } =
    useManageRoster(leagueId);
  const { user } = useAuth();
  const { showLogin } = useLoginModal();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const canChangeRosterToday = isTodayMonday();

  const { allowSave, hasFullRoster, message, title } = useMemo(() => {
    const hasFullRoster =
      savedRoster?.length === MAX_ROSTER_SIZE &&
      savedRoster?.every((r) => r !== null);

    return {
      allowSave: canChangeRosterToday || !hasFullRoster,
      hasFullRoster,
      message: "Teams may only be changed once per week, on Mondays.",
      title: "Are you sure you want to save this team?",
    };
  }, [canChangeRosterToday, savedRoster]);

  const handleSave = useCallback(() => {
    if (!user) {
      showLogin({
        onSuccess: () => {
          if (hasFullRoster) {
            setIsConfirmationModalOpen(hasFullRoster);
          } else {
            saveRoster();
          }
        },
      });
      return;
    }

    if (hasFullRoster) {
      setIsConfirmationModalOpen(hasFullRoster);
    } else {
      saveRoster();
    }
  }, [hasFullRoster, saveRoster, showLogin, user]);

  const saveable = canSave && allowSave;

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={saveRoster}
        onOpenChange={setIsConfirmationModalOpen}
        message={message}
        title={title}
      />
      <div
        className={cn(
          "shadow-sm bg-[#1C1F22] rounded-2xl p-6",
          className,
          keyboardVisible ? "px-2 py-1" : "",
        )}
      >
        <div
          className={cn(
            "flex justify-between items-center mb-4",
            keyboardVisible ? "hidden" : "",
          )}
        >
          <h2 className="text-2xl font-bold">My team</h2>

          <Button
            onClick={handleSave}
            className={cn(
              "rounded-full px-4 py-2 font-medium uppercase text-sm bg-white text-black hover:bg-white/90",
              !canSave && "opacity-50 cursor-not-allowed",
            )}
            disabled={!saveable}
            variant="secondary"
          >
            Save Team
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4 my-2">
          {currentRoster.map((scArtistId, index) => (
            <div key={index} className="min-w-0">
              {scArtistId ? (
                <SlotFilled
                  scArtistId={scArtistId}
                  keyboardVisible={keyboardVisible}
                  onRemove={
                    canChangeRosterToday ||
                    savedRoster === undefined ||
                    index >= savedRoster.length
                      ? () => toggleAddRemove(scArtistId)
                      : undefined
                  }
                />
              ) : (
                <SlotEmpty keyboardVisible={keyboardVisible} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
