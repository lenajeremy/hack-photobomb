"use client";

import { Button } from "@react-email/components";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data, status } = useSession();
  return (
    <header className="flex items-center justify-between">
      <h1>Picshaw</h1>
      {status == "loading" && <p>loading...</p>}

      {status == "unauthenticated" && (
        <Button>
          <Link href={"/auth/login"}>Sign In</Link>
        </Button>
      )}
      {status === "authenticated" && (
        <div className="flex">
          <p>{data.user?.name}</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      )}
    </header>
  );
}
