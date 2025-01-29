import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Listbox, ListboxItem } from "@nextui-org/react";

// Schema validation using Zod
const fileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
});

const FileList: React.FC<{ onFileSelect: (file: string) => void }> = ({
  onFileSelect,
}) => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(fileSchema),
  });
  const [files, setFiles] = useState<string[]>([]);

  const onSubmit = (data: { fileName: string }) => {
    setFiles([...files, data.fileName]);
    reset();
  };

  return (
    <div className="p-4 w-1/4 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <Input {...register("fileName")} placeholder="Enter file name" />
        <Button type="submit" className="mt-2">
          Add File
        </Button>
      </form>
      <Listbox>
        {files.map((file, idx) => (
          <ListboxItem key={idx} onClick={() => onFileSelect(file)}>
            {file}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
};

export default FileList;
