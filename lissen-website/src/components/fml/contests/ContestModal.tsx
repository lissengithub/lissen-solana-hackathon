"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import ContestCard from "./ContestCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dayjs from "dayjs";
import ContestLeaderboard from "./ContestLeaderboard";
import { Check, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/firebase/auth-context";
import { useLoginModal } from "@/components/LoginModal";
import { useContest } from "@/hooks/fml/useContest";
import { cn } from "@/lib/utils";

export default function ContestModal() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contestId");
  const [isOpen, setIsOpen] = useState(false);
  const { showLogin } = useLoginModal();

  const contest = useContest(contestId ?? "");

  useEffect(() => {
    if (contestId) {
      setIsOpen(true);
    }
  }, [contestId]);

  const handleClose = () => {
    setIsOpen(false);
    router.push(`/play`, { scroll: false });
  };

  const handleShare = async () => {
    if (!contest) return;

    const shareData = {
      title: `Join ${contest.name} on Lissen!`,
      text: `Join me in the ${contest.name}! Compete with music fans worldwide and win amazing prizes.`,
      url: `${window.location.origin}/play?contestId=${contest.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!contest) {
    return null;
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] md:min-w-[731px] max-h-[100svh] md:max-h-[80svh] overflow-hidden overflow-y-auto scrollbar p-0">
        <DialogHeader className="sticky -top-1 bg-background z-10 flex-row items-center justify-between px-4 pt-4 space-y-0">
          <DialogTitle className="text-xl font-semibold">
            Contest Details
          </DialogTitle>
          <DialogClose asChild className="mt-0">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="p-4">
          <ContestCard
            id={contest.id}
            timeRemaining={contest.timeRemaining}
            prizeAmount={contest.prizeAmount}
            name={contest.name}
            backgroundImage={contest.backgroundImage}
            isJoined={contest.isJoined}
            showJoinedStatus={false}
            contentClassName="from-0% via-background via-35% to-background to-100%"
            titleClassName="text-4xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prizes section */}
            <div className="border border-white/10 rounded-xl p-3">
              <h3 className="text-xl font-bold border-b border-b-white/10 pb-2">
                Prizes
              </h3>

              <div className="mt-4">
                <div className="space-y-6 mt-4">
                  {contest.prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl",
                        `fml-prize-rank-${prize.rankStart}`,
                      )}
                    >
                      <span className="font-extrabold text-[28px] leading-[32px] tracking-[-0.02em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,1)] shadow-[0px_2px_4px_0px_rgba(255,255,255,0.25)]">
                        {prize.rankStart}
                      </span>
                      <span className="text-black font-bold text-base">
                        {prize.prizeDescription}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About this contest section */}
            <div className="border border-white/10 rounded-xl p-3">
              <h3 className="text-lg font-semibold border-b border-b-white/10 pb-2">
                About this contest
              </h3>
              <p className="text-sm text-white/60 mt-2">{contest.about}</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-neutral-700 rounded-lg p-2">
                  <div className="text-white text-md font-bold">
                    {contest.leaderboardCount}
                  </div>
                  <div className="text-white/60 text-sm">PARTICIPANTS</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-2">
                  <div className="text-white text-md font-bold">
                    {dayjs(contest.startDate).format("MMM D")} -{" "}
                    {dayjs(contest.endDate).format("D")}
                  </div>
                  <div className="text-white/60 text-sm">PERIOD</div>
                </div>
              </div>

              {user && (
                <ContestLeaderboard contest={contest} className="mt-4" />
              )}

              <div className="mt-4">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="working-mechanism"
                >
                  <AccordionItem
                    value="working-mechanism"
                    className="rounded-lg overflow-hidden border border-white/10"
                  >
                    <AccordionTrigger className="text-white bg-neutral-700 px-4 py-2">
                      How it works
                    </AccordionTrigger>
                    <AccordionContent className="p-2">
                      {contest.howItWorks
                        ?.split("\n")
                        .map((line, index) => <div key={index}>{line}</div>)}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sticky -bottom-1 bg-background z-10 py-3">
          <div className="flex justify-center items-center w-full gap-2">
            {contest.isJoined && user ? (
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-3 py-2 rounded-full">
                <span className="text-sm font-medium text-white flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Joined
                </span>
              </div>
            ) : (
              <button
                className="bg-gradient-to-b from-sky-400/20 to-blue-500/20 px-3 py-2 rounded-full border border-sky-400"
                onClick={(e) => {
                  e.stopPropagation();
                  showLogin();
                }}
              >
                <span className="text-sm font-medium text-white flex items-center justify-center">
                  Join Now
                </span>
              </button>
            )}

            {/* Share button */}
            <Button
              variant="secondary"
              className="text-black bg-white hover:bg-white/80 rounded-full"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
