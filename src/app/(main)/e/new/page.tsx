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
import { Check, XSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function CreateEvent() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } =
    useForm<CreateEventFormData>({
      defaultValues: {
        name: "",
        slug: "",
        isPrivate: false,
      },
    });

  const name = watch("name");
  const slug = watch("slug");
  const isPrivate = watch("isPrivate");

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
    [createEvent, router]
  );

  React.useEffect(() => {
    const slug = slugify(name ?? "");
    setValue("slug", slug);
  }, [name, setValue]);

  return (
    <div className="flex items-center justify-center pt-16">
      <div className="p-4 w-[24rem]">
        <div className="flex flex-col text-center gap-1 w-4/5 mx-auto">
          <h1 className="text-2xl font-semibold">Create event</h1>
          <p className="text-muted-foreground text-sm">
            Create a special image repository for your event.
          </p>
        </div>
        <form onSubmit={handleSubmit(handleCreateEvent)}>
          <div className="space-y-3 mt-6">
            <div className="space-y-1">
              <Label className="text-sm">Event name:</Label>
              <Input
                placeholder="Enter the name of your event"
                {...register("name", { required: true })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Slug:</Label>
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
                    <span className="text-red-500 inline-flex gap-2">
                      <XSquare className="w-[18px] h-[18px]" />
                      <span>Slug is already taken</span>
                    </span>
                  )}

                  {verifySlugData && (
                    <span className="text-green-600 inline-flex gap-2">
                      <Check className="w-[18px] h-[18px]" />
                      <span>Slug is available</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Date of Event:</Label>
              <Input
                type="date"
                placeholder="when is your event happening?"
                className="text-left"
                {...register("eventDate", { required: true })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Description:</Label>
              <Textarea
                placeholder="description of your event"
                className="h-[140px]"
                {...register("description")}
              />
            </div>
            <div className="space-y-1 pb-2">
              <Label className="text-sm">Private Event?</Label>
              <div className="flex items-center justify-between gap-6">
                <p className="text-muted-foreground text-sm">
                  When you set an event as private, only people with the link
                  can view your event.
                </p>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={(v) => setValue("isPrivate", v)}
                />
              </div>
            </div>
            <Button loading={loading} className="w-full">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
