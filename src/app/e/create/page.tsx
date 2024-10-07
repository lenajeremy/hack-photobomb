"use server"
import { createEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import * as React from "react";

export default async function CreateEvent() {
  return (
    <div className="p-4">
      <form action={createEvent}>
        <div className="flex flex-col text-center gap-1">
          <h1 className="text-2xl font-semibold">create event</h1>
          <p className="text-muted-foreground text-sm">create a new event👍</p>
        </div>

        <div className="space-y-4 mt-6">
          <div className="space-y-1">
            <Label className="text-sm">event name:</Label>
            <Input placeholder="enter the name of your event" name="name" />
          </div>

          <div className="space-y-1">
            <Label className="text-sm">url path:</Label>
            <Input placeholder="unique url path for your event" name="slug" />
          </div>

          <div className="space-y-1">
            <Label className="text-sm">date:</Label>
            <Input type="date" name="eventDate" placeholder="when is your event happening?" className="text-left" />
          </div>

          <div className="space-y-1">
            <Label className="text-sm">description:</Label>
            <Textarea
              name="description"
              placeholder="description of your event"
              className="h-[140px]"
            />
          </div>
          <Button className="w-full bg-purple-500 text-white">create</Button>
        </div>
      </form>
    </div>
  );
}
