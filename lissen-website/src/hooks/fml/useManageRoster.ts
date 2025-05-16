import { useCallback, useEffect, useMemo } from "react";
import { useMyRoster } from "./useMyRoster";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { create } from "zustand";
import {
  useManageRosterSheet,
  useManageRosterSheetCallbacksStore,
} from "@/components/fml/ManageRosterSheet/useManageRosterSheet";
import { MAX_ROSTER_SIZE } from "@/constants/fml";
import { useAuth } from "@/lib/firebase/auth-context";

const useRosterStore = create<{
  roster: (string | null)[];
  setRoster: (roster: (string | null)[]) => void;
  setIsDirtyBeforeLogin: (isDirty: boolean) => void;
  isDirtyBeforeLogin: boolean;
}>((set) => ({
  roster: Array(MAX_ROSTER_SIZE).fill(null),
  setRoster: (roster) => set({ roster }),
  isDirtyBeforeLogin: false,
  setIsDirtyBeforeLogin: (isDirty) => set({ isDirtyBeforeLogin: isDirty }),
}));

export const useManageRoster = (leagueId: string) => {
  const { closeManageRoster } = useManageRosterSheet();
  const { user } = useAuth();
  const {
    query: { data: existingRoster, isLoading },
    invalidate: invalidateMyRoster,
  } = useMyRoster(leagueId);

  const { roster, setRoster, setIsDirtyBeforeLogin } = useRosterStore();

  useEffect(() => {
    if (!isLoading) {
      if (existingRoster && existingRoster.length > 0) {
        const rosterIds = existingRoster.map(
          (artist: { scArtistId: string }) => artist.scArtistId,
        );

        setRoster(rosterIds.slice(0, MAX_ROSTER_SIZE));
      } else {
        setRoster(Array(MAX_ROSTER_SIZE).fill(null));
      }
    }
  }, [existingRoster, isLoading, setRoster]);

  useEffect(() => {
    if (roster.length < MAX_ROSTER_SIZE) {
      const emptySlots = Array(MAX_ROSTER_SIZE - roster.length).fill(null);
      setRoster([...roster, ...emptySlots]);
    }
  }, [roster, setRoster]);

  const updateRosterMutation = trpc.fml.roster.update.useMutation({
    onSettled: async () => {
      await invalidateMyRoster();
      setIsDirtyBeforeLogin(false);
      useManageRosterSheetCallbacksStore.getState().executeAndClearCallback();
    },
  });

  const removeArtist = useCallback(
    (artistId: string) => {
      const newRoster = roster
        .map((id) => (id === artistId ? null : id))
        .filter((id) => id !== null);

      setRoster(newRoster);
    },
    [roster, setRoster],
  );

  const addArtist = useCallback(
    (artistId: string) => {
      if (roster.includes(artistId)) {
        toast.error("Artist already in team");
        return;
      }

      if (roster.filter(Boolean).length >= MAX_ROSTER_SIZE) {
        toast.error("Roster Full", {
          description:
            "Your roster is full. Remove an artist first to add a new one.",
        });
        return;
      }

      const prevRoster = roster;
      const firstEmptySlotIndex = prevRoster.findIndex((id) => id === null);

      if (firstEmptySlotIndex !== -1) {
        const newRoster = [...prevRoster];
        newRoster[firstEmptySlotIndex] = artistId;
        setRoster(newRoster);
        if (!user) {
          setIsDirtyBeforeLogin(true);
        }
      }
    },
    [roster, setRoster, user, setIsDirtyBeforeLogin],
  );

  const toggleAddRemove = useCallback(
    (artistId: string) => {
      if (roster.includes(artistId)) {
        removeArtist(artistId);
      } else {
        addArtist(artistId);
      }
    },
    [roster, removeArtist, addArtist],
  );

  const canAddOrRemove = useCallback(
    (artistId: string) => {
      if (roster.includes(artistId)) {
        return true;
      }

      if (roster.filter(Boolean).length >= MAX_ROSTER_SIZE) {
        return false;
      }

      return true;
    },
    [roster],
  );

  const saveRoster = useCallback(() => {
    const finalRoster = roster.filter((id) => id !== null);
    updateRosterMutation.mutate(
      {
        artists: finalRoster.map((id, index) => ({
          scArtistId: id,
          position: index,
        })),
        leagueId,
      },
      {
        onSuccess: () => {
          closeManageRoster();
        },
      },
    );
  }, [roster, leagueId, updateRosterMutation, closeManageRoster]);

  useEffect(() => {
    if (user && leagueId && useRosterStore.getState().isDirtyBeforeLogin) {
      const localRoster = useRosterStore
        .getState()
        .roster.filter((id) => id !== null) as string[];
      const remoteRosterIds =
        existingRoster?.map((r) => r.scArtistId).filter((id) => id !== null) ||
        [];

      const localSet = new Set(localRoster);
      const remoteSet = new Set(remoteRosterIds);

      let differs = localRoster.length !== remoteRosterIds.length;
      if (!differs) {
        for (const id of Array.from(localSet)) {
          if (!remoteSet.has(id)) {
            differs = true;
            break;
          }
        }
      }

      if (!(localRoster.length > 0 && differs)) {
        setIsDirtyBeforeLogin(false);
      }
    }
  }, [user, leagueId, existingRoster, setIsDirtyBeforeLogin]);

  const canSave = useMemo(() => {
    if (!existingRoster) return true;
    const existingIds = existingRoster.map((artist) => artist.scArtistId);
    const currentIds = roster.filter((id): id is string => id !== null);
    return (
      !existingIds.every((id) => currentIds.includes(id)) ||
      !currentIds.every((id) => existingIds.includes(id))
    );
  }, [roster, existingRoster]);

  return {
    currentRoster: roster,
    isLoading,
    addArtist,
    removeArtist,
    toggleAddRemove,
    canAddOrRemove,
    saveRoster,
    savedRoster: existingRoster,
    canSave,
  };
};
