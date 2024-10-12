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
import { ApiResponse } from "@/types";
import { Event } from "@prisma/client";

export default function Home() {
  const params = useParams();
  const eventSlug = params["event-slug"];

  const {} = useFetch<void, ApiResponse<Event>>(`/api/e/${eventSlug}`, undefined, {
    fetchOnRender: true,
  });

  // const [select, setSelect] = React.useState(false);

  return (
    <div>
<UploadModal />
    </div>
  );
}

function UploadModal() {
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
        <Button variant="outline">Upload Images</Button>
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
            <Button loading ={loading} type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
