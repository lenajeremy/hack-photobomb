"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
import Loader from "@/components/ui/loader";
import { ApiResponse } from "@/types";
import { Event } from "@prisma/client";

export default function Home() {
  const { loading, data, error } = useFetch<void, ApiResponse<Event[]>>(
    "/api/e",
    {},
    { fetchOnRender: true }
  );

  return (
    <div>
      <h1>Groups</h1>
      <p>List of all the groups that the user belongs to</p>
      <Button asChild>
        <Link href="/e/new">Create a group</Link>
      </Button>

      {loading && (
        <div className="flex gap-2">
          <p>Loading...</p>
          <Loader />
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-2">
          {data.data.map((e) => (
            <Link key={e.id} href={"/e/" + e.slug}>
              <div className="p-2">
                <h2 className="text-lg font-semibold">{e.name}</h2>
                <p className="text-muted-foreground">
                  {e.description.slice(0, 150)}
                </p>
                <p>Date: {new Date(e.eventDate).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {error && (
        <pre className="text-red-500">{JSON.stringify({ error }, null, 3)}</pre>
      )}
    </div>
  );
}
