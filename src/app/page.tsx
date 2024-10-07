"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function Home() {
  const [files, setFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  const filesUrl = React.useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  React.useEffect(() => {
    console.log(files);
    // const properties = ["webkitdirectory", "directory"];
    // for (const prop of properties) {
    // inputRef.current?.setAttribute(prop, "");
    // }
  }, [files]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = new FormData();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formdata.set(`image-${i + 1}`, file, file.name);
      }

      const res = await fetch("/api/e/devfest-lagos-24", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      method="POST"
      action="/api/e/devfest-lagos-24"
      className="px-4 h-screen flex flex-col items-center justify-center gap-6"
      onSubmit={handleSubmit}
      encType="multipart/formdata"
    >
      <div className="flex flex-col text-center gap-1">
        <h1 className="text-2xl font-semibold">Upload Files</h1>
        <p className="text-muted-foreground text-sm">
          Upload files that you want to be added to the repository
        </p>
      </div>
      <Input
        onChange={(e) => setFiles(Array.from(e.currentTarget.files || []))}
        type="file"
        name="files"
        multiple
        accept="image/*"
        ref={inputRef}
      />
      {files.length == 0 ? (
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
      <Button className="w-full" disabled={loading}>
        {loading ? "Loading..." : "Upload"}
      </Button>
    </form>
  );
}
