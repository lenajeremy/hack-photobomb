"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
import { ApiResponse } from "@/types";
import { Event } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";


export default function Home() {
  const { loading, data, error } = useFetch<void, ApiResponse<Event[]>>(
    "/api/e",
    {},
    { fetchOnRender: true }
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm opacity-60">
            Find your event or create a new one.
          </p>
        </div>
        <Button asChild size={"sm"}>
          <Link href="/e/new">Create event</Link>
        </Button>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-2">
            {data.data.map((e) => (
              <Link key={e.id} href={"/e/" + e.slug}>
                <div className="">
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
          <pre className="text-red-500">
            {JSON.stringify({ error }, null, 3)}
          </pre>
        )}
      </div>
    </div>
  );
}
