"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { useParams, useRouter } from "next/navigation";
import { ApiResponse, GetUploadsResponse } from "@/types";
import Loader from "@/components/ui/loader";
import EmptyState from "@/components/ui/empty";
import { List, Grid, Plus, ChevronLeft, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareLink } from "@prisma/client";
import { toast } from "sonner";

export default function Home() {
  const params = useParams();
  const eventSlug = params["event-slug"];
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const router = useRouter();

  const {
    loading,
    data,
    trigger: getEventDetails,
  } = useFetch<void, GetUploadsResponse>(`/api/e/${eventSlug}`, undefined, {
    fetchOnRender: true,
  });

  const { trigger: createShareLink, loading: isCreatingLink } = useFetch<
    void,
    ApiResponse<ShareLink>
  >(`/api/join/${eventSlug}`, { method: "POST" });

  const handleShare = React.useCallback(async () => {
    try {
      const res = await createShareLink();
      const d = {
        text: "Joining event gives you access to all the images",
        title: `Click to join "${data?.data.name}" event`,
        url: `${window.location.origin}/join/${res?.data.link}`,
      };
      const shareres = await navigator.share(d);
      console.log(shareres);
      toast.success("Link shared successfully");
    } catch (err) {
      toast.error(JSON.stringify(err));
    }
  }, [data, createShareLink]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Button size={"icon"} variant={"ghost"} onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <h1 className="text-lg md:text-xl font-semibold">
            {data?.data.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <UploadModal onUploadSuccess={getEventDetails} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={"outline"}
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? <List /> : <Grid />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-muted-foreground">
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={"outline"}
                  onClick={handleShare}
                  loading={isCreatingLink}
                >
                  <Share2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-muted-foreground">Share Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {loading && (
        <div className="flex gap-2">
          <p>Loading...</p>
          <Loader />
        </div>
      )}
      {data && (
        <PhotosGallery
          onUploadSuccess={getEventDetails}
          photos={data.data.uploads.map((d) => d.files).flat()}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}

function PhotosGallery({
  photos,
  onUploadSuccess,
  viewMode,
}: {
  photos: Array<{ publicURL: string; id: string }>;
  onUploadSuccess: Function;
  viewMode: "grid" | "list";
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(
            "scale-[98%]",
            "opacity-70",
            "blur-[2px]",
            "brightness-75"
          );
          entry.target.classList.add(
            "scale-100",
            "opacity-100",
            "blur-0",
            "brightness-100"
          );
        } else {
          entry.target.classList.remove(
            "scale-100",
            "opacity-100",
            "blur-0",
            "brightness-100"
          );
          entry.target.classList.add(
            "scale-[98%]",
            "opacity-70",
            "blur-[2px]",
            "brightness-75"
          );
        }
      });
    }, options);

    containerRef.current
      ?.querySelectorAll(".image-content")
      .forEach((content) => {
        observer.observe(content);
      });
  }, []);

  if (photos.length === 0) {
    return (
      <div className="h-[calc(80vh)] w-full flex gap-4 flex-col items-center justify-center">
        <EmptyState width="100" height="100" />
        <p className="text-center text-sm text-muted-foreground">
          No images found
        </p>
        <UploadModal
          onUploadSuccess={onUploadSuccess}
          uploadTrigger={
            <Button>
              <Plus />
              Upload Image
            </Button>
          }
        />
      </div>
    );
  } else if (viewMode === "list") {
    return (
      <div
        ref={containerRef}
        className="h-[calc(100vh-81px)] overflow-y-scroll space-y-2"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {photos.map((file) => (
          <div
            key={file.id}
            className="h-[95%] w-full relative bg-slate-400 rounded overflow-hidden image-content transition-all duration-1000"
            style={{ scrollSnapAlign: "center" }}
          >
            <Image
              src={file.publicURL}
              width={400}
              height={400}
              alt=""
              className="object-cover h-full w-full"
            />
            {/* <div className="absolute bottom-0 left-0 px-4 py-2">
                <p>{upload.text}</p>
              </div> */}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1 my-6">
        {photos.map((file) => (
          <Image
            key={file.id}
            src={file.publicURL}
            width={400}
            height={400}
            alt=""
            className="aspect-square object-cover"
          />
        ))}
      </div>
    );
  }
}

function UploadModal({
  onUploadSuccess,
  uploadTrigger,
}: {
  onUploadSuccess: Function;
  uploadTrigger?: React.ReactNode;
}) {
  const params = useParams();
  const eventSlug = params["event-slug"];
  const [open, setOpen] = React.useState(false);

  const [files, setFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { trigger, loading } = useFetch<FormData, ApiResponse<object>>(
    `/api/e/${eventSlug}`,
    {
      method: "POST",
    }
  );

  const filesUrl = React.useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formdata.set(`image-${i + 1}`, file, file.name);
      }

      await trigger(formdata);
      setOpen(false);
      onUploadSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {uploadTrigger ? (
        <DialogTrigger asChild>uploadTrigger</DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button className="w-9 p-0 md:w-auto md:px-5 md:py-2">
                  <Plus />
                  <span className="md:inline-block hidden">Upload Images</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-muted-foreground">
                Upload images from your event
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Select images that you want to be added to the repository.
          </DialogDescription>
        </DialogHeader>
        <form className="py-4" onSubmit={handleSubmit}>
          <div className="items-center gap-4">
            <Label htmlFor="files" className="text-right">
              Select files
            </Label>
            <Input
              onChange={(e) =>
                setFiles(Array.from(e.currentTarget.files || []))
              }
              type="file"
              name="files"
              multiple
              accept="image/*"
              ref={inputRef}
            />
          </div>
          {files.length === 0 ? (
            <div className="my-4 py-8">
              <p className="text-sm text-muted-foreground text-center">
                No files selected
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-1 my-4">
              {filesUrl.map((f) => (
                <Image
                  src={f}
                  width={400}
                  height={400}
                  alt=""
                  className="aspect-square object-cover"
                  key={f}
                />
              ))}
            </div>
          )}

          <DialogFooter>
            <Button loading={loading} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
