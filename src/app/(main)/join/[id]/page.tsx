"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import useFetch from "@/hooks/useFetch";
import { ApiResponse } from "@/types";
import { Link } from "lucide-react";
import { useParams } from "next/navigation";

export default function JoinEvent() {
  const { id } = useParams();

  const { loading, error, data, trigger } = useFetch<
    void,
    ApiResponse<{ name: string; slug: string; id: string }>
  >(`/api/join/${id}`, { method: "PUT" }, { fetchOnRender: true });

  if (loading) {
    return (
      <div className="h-[90vh] flex items-center justify-center gap-2">
        <Loader />
        <p>Loading</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[90vh] flex items-center justify-center gap-2">
        <p>Failed to join event</p>
        <Button onClick={() => trigger()}>Try again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <h1 className="text-lg md:text-xl font-semibold">
            {data?.data.name}
          </h1>
        </div>
        <Button asChild>
          <Link href={`/e/${data?.data.slug}`}>Go to event</Link>
        </Button>
      </div>
    </div>
  );
}
