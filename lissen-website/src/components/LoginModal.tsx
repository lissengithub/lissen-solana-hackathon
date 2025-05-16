import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { create } from "zustand";

interface LoginActionsStoreState {
  onSuccessCallback: (() => void) | null;
  setOnSuccessCallback: (callback: (() => void) | null) => void;
  executeAndClearCallback: () => void;
}

const useLoginActionsStore = create<LoginActionsStoreState>((set, get) => ({
  onSuccessCallback: null,
  setOnSuccessCallback: (callback) => set({ onSuccessCallback: callback }),
  executeAndClearCallback: () => {
    const callback = get().onSuccessCallback;
    if (callback) {
      callback();
      set({ onSuccessCallback: null });
    }
  },
}));

export function useLoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("login") === "true";
  const { setOnSuccessCallback } = useLoginActionsStore();

  const showLogin = (callbacks?: { onSuccess?: () => void }) => {
    setOnSuccessCallback(callbacks?.onSuccess || null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("login", "true");
    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const closeLogin = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    router.replace(
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  };

  return {
    isOpen,
    showLogin,
    closeLogin,
  };
}

export default function LoginModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { authenticate, sendPasswordResetEmail } = useAuth();
  const { isOpen, closeLogin } = useLoginModal();
  const { executeAndClearCallback } = useLoginActionsStore();

  const handleAuth = async (provider?: "google" | "apple") => {
    setIsLoading(true);
    setError(undefined);

    const result = await authenticate(
      provider ? { provider } : { email, password },
    );

    if (result.success) {
      closeLogin();
      executeAndClearCallback();
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    try {
      if (!email) {
        toast.error("Please enter an email address.");
        return;
      }
      await sendPasswordResetEmail(email);
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeLogin()}>
      <DialogContent className="sm:max-w-md max-h-[100svh] md:max-h-[80svh] overflow-hidden overflow-y-auto scrollbar">
        <div className="w-full space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Lissen"
              width={170}
              height={48}
              className="min-w-[140px] min-h-[40px]"
            />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Log in or sign up</h1>
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth().catch((error) => {
                console.error(error);
              });
            }}
          >
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                autoComplete="email"
                autoCapitalize="none"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="button"
              className="text-center w-full text-sm text-white/70 hover:text-white"
              onClick={handleResetPassword}
            >
              Forgot password?
            </button>

            <Button
              type="submit"
              className="w-full py-4 font-semibold text-md"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "CONTINUE"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 font-semibold">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleAuth("google")}
              disabled={isLoading}
              className="w-full py-3 bg-white/10 rounded-lg border border-white/20 font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Image
                src="/images/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="opacity-80"
              />
              Continue with Google
            </button>
            <button
              onClick={() => handleAuth("apple")}
              disabled={isLoading}
              className="w-full py-3 bg-white text-black rounded-lg border border-white/20 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Image
                src="/images/apple.svg"
                alt="Apple"
                width={20}
                height={20}
                className="opacity-80"
              />
              Continue with Apple
            </button>
          </div>

          {/* Terms */}
          <p className="text-sm text-center text-white/50 px-4">
            By continuing you indicate that you have read and agree to
            Lissen&apos;s{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_CDN_URL}/terms_and_conditions.pdf`}
              target="_blank"
              className="underline text-primary hover:text-primary/80"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="underline text-primary hover:text-primary/80"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
