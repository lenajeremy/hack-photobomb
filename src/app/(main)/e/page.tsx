import { auth } from "@/auth";
import EmptyState from "@/components/ui/empty";
import EventCard from "@/components/ui/event-card";
import prisma from "@/lib/db";
import * as React from "react";

export default async function ListEvents() {
  const session = await auth();
  const events = await prisma.event
    .findMany({
      where: {
        isPrivate: false,
        OR: [{ ownerId: session?.user?.id }],
      },
      include: {
        _count: {
          select: {
            participants: true, // Count participants for each event
          },
        },
      },
      skip: 0,
      take: 20,
    })
    .then((events) =>
      events.map((event) => ({
        ...event,
        attendees: event._count.participants,
      }))
    );

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Discover Events</h1>
        <p className="text-muted-foreground text-sm w-4/5">
          Discover events that are happening around you or these could be events
          you&apos;ve attended before👍
        </p>
      </div>

      <div>
        {events.length === 0 && <EmptyState width="200" height="200" />}
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
