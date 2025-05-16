"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Gem } from "lucide-react";
import { useLoginModal } from "@/components/LoginModal";
import { useMe } from "@/hooks/useMe";
import { useGems } from "@/hooks/useGems";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header
      className={`text-gray-800 dark:text-gray-200 py-4 sticky top-0 w-[100vw] z-50 transition-all md:bg-background`}
    >
      <div className="flex justify-between items-center container">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Lissen"
            width={170}
            height={48}
            className="min-w-[140px] min-h-[40px]"
          />
        </Link>

        <nav>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16">
              {/* Show hamburger menu only on small/medium screens */}
              <div className="xl:hidden flex items-center rounded-full px-1 py-0 bg-white/5 text-white hover:bg-white/15 border border-white/10">
                {user ? <UserDropdown hideChevron /> : null}
                <Button
                  variant="ghost"
                  onClick={() => setOpen(true)}
                  className="p-2 hover:bg-transparen"
                >
                  <Icon
                    name="hamburger"
                    className="fill-gray-800 dark:fill-gray-200"
                  />
                </Button>
              </div>

              {/* Show direct links on large screens */}
              <div className="hidden xl:flex xl:items-center xl:space-x-8 bg-gradient-to-r from-black/50 to-black/20 border border-white/10 backdrop-blur-lg xl:px-8 xl:py-2 rounded-full">
                <NavLinks onClick={() => setOpen(false)} />
              </div>
            </div>
          </div>

          {/* Sheet for mobile/tablet navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
              className="pt-16 flex flex-col justify-between"
              side="left"
            >
              <NavLinks onClick={() => setOpen(false)} />

              <div className="flex flex-col gap-y-4 mt-4">
                {user ? null : (
                  <>
                    <LoginButton
                      text="Login"
                      variant="outline"
                      className="w-full"
                      onClick={() => setOpen(false)}
                    />
                    <LoginButton
                      text="Sign up"
                      variant="default"
                      className="w-full"
                      onClick={() => setOpen(false)}
                    />
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>

        <div className="hidden xl:flex xl:items-center xl:gap-x-4">
          {user ? (
            <div className="flex items-center gap-2 rounded-full p-1 bg-white/5 text-white hover:bg-white/15 border border-white/10">
              <UserDropdown />
            </div>
          ) : (
            <>
              <LoginButton text="Login" variant="outline" />
              <LoginButton text="Sign up" variant="default" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

const LoginButton = ({
  text,
  variant,
  className,
  onClick,
}: {
  text: string;
  variant: "outline" | "default";
  className?: string;
  onClick?: () => void;
}) => {
  const { showLogin } = useLoginModal();

  const handleClick = () => {
    onClick?.();
    showLogin();
  };

  return (
    <Button
      variant={variant}
      className={cn(
        "w-24 font-semibold text-base leading-[150%] tracking-[0%] font-inter uppercase rounded-full py-4",
        className,
        variant === "outline" && "border-white",
      )}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

// Separate component for nav links to avoid duplication
const NavLinks = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col xl:flex-row space-y-4 xl:space-y-0 xl:space-x-16 xl:items-center">
      <NavLink href="/play" onClick={onClick}>
        Play
      </NavLink>
      <NavLink href="/songs" onClick={onClick}>
        Songs
      </NavLink>
      <a
        className="font-medium flex flex-row items-center gap-1"
        href="https://intercom.help/lissen-ltd"
        target="_blank"
        onClick={onClick}
      >
        FAQ <Icon name="externalLink" />
      </a>
    </div>
  );
};

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  const isActive = firstSegment === href.split("/")[1];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`uppercase py-1 ${
        isActive
          ? "font-extrabold bg-gradient-to-r from-primary to-secondary bg-[length:100%_2px] bg-no-repeat bg-bottom"
          : "font-medium"
      }`}
    >
      {children}
    </Link>
  );
};

const UserDropdown = ({ hideChevron }: { hideChevron?: boolean }) => {
  const { logout } = useAuth();
  const {
    query: { data: user },
  } = useMe();
  const {
    query: { data: gemsData },
  } = useGems();

  const [isAnimatingGems, setIsAnimatingGems] = useState(false);
  const prevGemsRef = useRef<number | undefined>();

  useEffect(() => {
    if (gemsData?.gems !== undefined) {
      // Only animate if prevGemsRef.current is defined (not initial render)
      // and the gem count has actually changed.
      if (
        prevGemsRef.current !== undefined &&
        prevGemsRef.current !== gemsData.gems
      ) {
        setIsAnimatingGems(true);
        const timer = setTimeout(() => {
          setIsAnimatingGems(false);
        }, 300); // Duration the scaled state is active, allowing for transition in and out
        return () => clearTimeout(timer);
      }
      prevGemsRef.current = gemsData.gems;
    }
  }, [gemsData?.gems]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <div className="flex items-center flex-row gap-2">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User avatar"}
                width={16}
                height={16}
                className="rounded-full object-cover w-8 h-8"
              />
            ) : (
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <User className="h-6 w-6" color="black" />
              </div>
            )}
            {gemsData && (
              <div
                className={cn(
                  "flex items-center gap-0.5",
                  "transition-transform duration-150 ease-in-out",
                  isAnimatingGems ? "scale-125" : "scale-100",
                )}
              >
                <Gem className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold">{gemsData.gems}</span>
              </div>
            )}
            {!hideChevron && <ChevronDown className="h-4 w-4" />}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-neutral-800 text-white border-none"
      >
        <DropdownMenuItem className="pointer-events-none">
          {user?.email}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-white/20 focus:bg-white/20 hover:cursor-pointer hover:underline"
          onClick={() => {
            window.open(
              `https://explorer.solana.com/address/${user?.solanaWalletPublicKey}?cluster=devnet`,
              "_blank",
            );
          }}
        >
          {user?.solanaWalletPublicKey}
          <Icon
            name="externalLink"
            className="ml-1 h-2.5 w-2.5 hidden sm:inline sm:h-3 sm:w-3"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="hover:bg-white/20 focus:bg-white/20"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
