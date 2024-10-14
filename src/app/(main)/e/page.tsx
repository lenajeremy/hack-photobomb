import { auth } from "@/auth";
import EmptyState from "@/components/ui/empty";
import prisma from "@/lib/db";
import * as React from "react";

export default async function ListEvents() {
  const session = await auth();
  const events = await prisma.event.findMany({
    where: {
      isPrivate: false,
      OR: [{ ownerId: session?.user?.id }],
    },
    skip: 0,
    take: 20,
  });

  return (
    <div className="p-4">
      <div className="flex flex-col text-center gap-1">
        <h1 className="text-2xl font-semibold">Discover Events</h1>
        <p className="text-muted-foreground text-sm">
          Discover events that are happening around you or these could be events
          you&apos;ve attended before👍
        </p>
      </div>

      <div>
        {events.length === 0 && <EmptyState width="200" height="200" />}
        {events.map((e) => (
          <div key={e.id} className="p-2">
            <h2 className="text-xl font-semibold">{e.name}</h2>
            <p className="text-muted-foreground">{e.description}</p>
            <p>Date: {e.eventDate.toLocaleDateString()}</p>
            {/* <p>Time: {e.eventDate.toLocaleTimeString()}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
