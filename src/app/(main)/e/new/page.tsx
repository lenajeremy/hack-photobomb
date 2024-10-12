"use client";
import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import * as React from "react";
import { slugify } from "@/lib/utils";
import { ApiResponse, CreateEventFormData } from "@/types";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

export default function CreateEvent() {
  const { register, handleSubmit, watch, setValue } =
    useForm<CreateEventFormData>();
  const name = watch("name");

  const {
    trigger: createEvent,
    data,
    loading,
    error,
  } = useFetch<CreateEventFormData, ApiResponse<Event>>("/api/e/new", {
    method: "POST",
  });

  const handleCreateEvent = React.useCallback(
    async (data: CreateEventFormData) => {
      try {
        const res = await createEvent(data);
        console.log(res);
      } catch (err) {
        console.log("catching a new error");
        toast.error(JSON.stringify(err));
        console.log(err);
      }
    },
    [createEvent]
  );

  React.useEffect(() => {
    setValue("slug", slugify(name ?? ""));
  }, [name, setValue]);

  // React.useEffect(() => {
  //   console.log(error)
  //   if (error) {
  //     toast.error(JSON.stringify(error));
  //   }
  // }, [error]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(handleCreateEvent)}>
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
          <Button loading={loading} className="w-full bg-purple-500 text-white">
            create
          </Button>
        </div>
        <pre>{JSON.stringify({ error, data }, null, 3)}</pre>
      </form>
    </div>
  );
}
