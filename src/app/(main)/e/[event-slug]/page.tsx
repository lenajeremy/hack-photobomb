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
import { useParams } from "next/navigation";
import { ApiResponse, GetUploadsResponse } from "@/types";
import Loader from "@/components/ui/loader";

export default function Home() {
  const params = useParams();
  const eventSlug = params["event-slug"];

  const { loading, data } = useFetch<void, GetUploadsResponse>(
    `/api/e/${eventSlug}`,
    undefined,
    {
      fetchOnRender: true,
    }
  );

  return (
    <div>
      {/* <UploadModal /> */}
      {loading && (
        <div className="flex gap-2">
          <p>Loading...</p>
          <Loader />
        </div>
      )}
      {data && (
        <PhotosGallery photos={data.data.uploads.map((d) => d.files).flat()} />
      )}
    </div>
  );
}

function PhotosGallery({
  photos,
}: {
  photos: Array<{ publicURL: string; id: string }>;
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
}

function _() {
  const params = useParams();
  const eventSlug = params["event-slug"];

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

      const data = trigger(formdata);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Images</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
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
            <div>
              <p>No files selected</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1">
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

console.log(_)