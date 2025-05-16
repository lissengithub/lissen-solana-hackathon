import { useRouter, useSearchParams, useParams } from "next/navigation";
import { create } from "zustand";

export const useManageRosterSheetCallbacksStore = create<{
  onSaveCallback: () => void;
  setOnSaveCallback: (callback?: () => void) => void;
  executeAndClearCallback: () => void;
}>((set, get) => ({
  onSaveCallback: () => {},
  setOnSaveCallback: (callback) =>
    set({ onSaveCallback: callback ?? (() => {}) }),
  executeAndClearCallback: () => {
    const callback = get().onSaveCallback;
    if (callback) {
      callback();
      set({ onSaveCallback: () => {} });
    }
  },
}));

export const useManageRosterSheet = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { leagueId } = useParams<{ leagueId: string }>();
  const key = "manage-team";
  const isOpen = searchParams.get(key) === "true";

  const manageRoster = (
    leagueId: string,
    { onSave }: { onSave?: () => void } = {},
  ) => {
    useManageRosterSheetCallbacksStore.getState().setOnSaveCallback(onSave);
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, "true");
    router.push(`/play/leagues/${leagueId}?${params.toString()}`, {
      scroll: false,
    });
  };

  const closeManageRoster = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`/play/leagues/${leagueId}?${params.toString()}`, {
      scroll: false,
    });
  };

  return {
    isOpen,
    leagueId,
    manageRoster,
    closeManageRoster,
  };
};
