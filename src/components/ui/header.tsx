"use client";

import { LogOut, Moon, Sun, Laptop, User, Earth } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export default function Header() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const { data, status } = useSession();
  return (
    <header className="flex items-center justify-between container mx-auto p-4 border-b sticky top-0 z-50 bg-background">
      <Link href={"/"}>
        {resolvedTheme === "dark" ? (
          <Image
            src={"/picshaw-dark.svg"}
            alt="Picshaw Logo"
            width={100}
            height={36}
          />
        ) : (
          <Image
            src={"/picshaw.svg"}
            alt="Picshaw Logo"
            width={100}
            height={36}
          />
        )}
      </Link>

      {status == "loading" && <p>loading...</p>}

      {status == "unauthenticated" && (
        <Button>
          <Link href={"/auth/login"}>Sign In</Link>
        </Button>
      )}

      {status === "authenticated" && (
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={data.user?.image ?? ""}
                  alt={`${data.user?.name}'s avatar`}
                />
                <AvatarFallback className="bg-primary text-white">
                  {data.user?.name
                    ?.split(" ")
                    .reduce((acc, curr) => acc + curr[0], "")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>Extras</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/e">
                  <Earth className="mr-2 h-4 w-4" />
                  <span>Discover Events</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
                    {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
                    {theme === "system" && <Laptop className="mr-2 h-4 w-4" />}
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
