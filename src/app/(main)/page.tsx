"use client";

import * as React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [groups, setGroups] = React.useState<unknown[]>([]);

  return (
    <div>
      <h1>Groups</h1>
      <p>List of all the groups that the user belongs to</p>
      <Button asChild>
        <Link href="/e/new">Create a group</Link>
      </Button>
    </div>
  );
}
