"use client";
// import { createEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { SubmitHandler, useForm } from "react-hook-form";
import * as React from "react";
import { slugify } from "@/lib/utils";
import { CreateEventFormData } from "@/types";

export default function CreateEvent() {
  const { register, handleSubmit, watch, setValue } =
    useForm<CreateEventFormData>();
  const name = watch("name");

  React.useEffect(() => {
    setValue("slug", slugify(name ?? ""));
  }, [name, setValue]);

  const createEvent: SubmitHandler<CreateEventFormData> = React.useCallback(
    async (data) => {
      const res = await fetch("/api/e/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log(json);
    },
    []
  );

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(createEvent)}>
        <div className="flex flex-col text-center gap-1">
          <h1 className="text-2xl font-semibold">create event</h1>
          <p className="text-muted-foreground text-sm">create a new event👍</p>
        </div>

        <div className="space-y-4 mt-6">
          <div className="space-y-1">
            <Label className="text-sm">event name:</Label>
            <Input
              placeholder="enter the name of your event"
              {...register("name", { required: true })}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm">url path:</Label>
            <Input
              placeholder="unique url path for your event"
              {...register("slug", { required: true })}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm">date:</Label>
            <Input
              type="date"
              placeholder="when is your event happening?"
              className="text-left"
              {...register("eventDate", { required: true })}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm">description:</Label>
            <Textarea
              placeholder="description of your event"
              className="h-[140px]"
              {...register("description")}
            />
          </div>
          <Button className="w-full bg-purple-500 text-white">create</Button>
        </div>
      </form>
    </div>
  );
}
