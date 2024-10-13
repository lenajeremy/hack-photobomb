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
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } =
    useForm<CreateEventFormData>({
      defaultValues: {
        name: "",
        slug: "",
      },
    });

  const name = watch("name");
  const slug = watch("slug");

  const { trigger: createEvent, loading } = useFetch<
    CreateEventFormData,
    ApiResponse<Event>
  >("/api/e/new", {
    method: "POST",
  });

  const {
    loading: verifySlugLoading,
    error: verifySlugError,
    data: verifySlugData,
  } = useFetch<void, ApiResponse<boolean>, ApiResponse<boolean>>(
    `/api/e/verify-slug/${slug}`,
    undefined,
    { debouncedDuration: 0.5, fetchOnArgsChange: true }
  );

  const handleCreateEvent = React.useCallback(
    async (data: CreateEventFormData) => {
      try {
        const res = await createEvent(data);
        toast.success("Event created successfully");
        router.push("/e/" + res?.data.slug);
      } catch (err) {
        toast.error(JSON.stringify(err));
        console.log(err);
      }
    },
    [createEvent]
  );

  React.useEffect(() => {
    const slug = slugify(name ?? "");
    setValue("slug", slug);
  }, [name, setValue]);

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
            <div className="space-y-2">
              <Input
                placeholder="unique url path for your event"
                {...register("slug", { required: true })}
              />
              <p className="text-xs">
                {verifySlugLoading && (
                  <span className="inline-flex gap-2 text-muted-foreground">
                    <Loader className="w-[18px]" />
                    <span>Verifying slug availability...</span>
                  </span>
                )}

                {verifySlugError && (
                  <span className="text-red-500">
                    <span>Slug is already taken</span>
                  </span>
                )}

                {verifySlugData && (
                  <span className="text-green-600">
                    <span>Slug is available</span>
                  </span>
                )}
              </p>
            </div>
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
      </form>
    </div>
  );
}
