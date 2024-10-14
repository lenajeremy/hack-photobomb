import { Event } from "@prisma/client";
import Link from "next/link";
import { Badge } from "./badge";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";
import { CalendarIcon, ChevronRightIcon, UsersIcon } from "lucide-react";

export default function EventCard({
  event,
}: {
  event: Event & { attendees: number };
}) {
  return (
    <Card className="backdrop-blur-md bg-border border-accent overflow-hidden group hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            <h2 className="text-xl font-semibold mb-1">{event.name}</h2>
            <Badge variant={"secondary"} className="text-xs">
              {event.isPrivate ? "Private Event" : "Public Event"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">
          {event.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-purple-400" />
            {typeof event.eventDate === "string"
              ? new Date(event.eventDate).toLocaleDateString()
              : new Date(event.eventDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-2 text-purple-400" />
            {event.attendees} attendees
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center backdrop-blur-sm">
        <Button
          asChild
          variant="outline"
          className="group-hover:translate-x-1 transition-transform duration-200"
        >
          <Link href={"/e/" + event.slug}>
            View Details
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
