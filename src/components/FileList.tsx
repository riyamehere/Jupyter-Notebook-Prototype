import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

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
    <div className="p-4 w-1/4 bg-gray-200 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <Input
          {...register("fileName")}
          placeholder="Enter file name"
          className="bg-white rounded-md"
        />
        <Button
          type="submit"
          className="mt-2 bg-blue-300 cursor-pointer rounded-md"
        >
          Add File
        </Button>
      </form>
      <div className="space-y-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            onClick={() => onFileSelect(file)}
            className="p-2 rounded-md cursor-pointer bg-white hover:bg-gray-300 transition duration-200"
          >
            {file}.py
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
