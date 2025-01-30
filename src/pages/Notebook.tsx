import React, { useState } from "react";
import FileList from "../components/FileList";
import FileEditor from "../components/FileEditor";

const Notebook: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex">
      <FileList onFileSelect={setSelectedFile} />
      <FileEditor selectedFile={selectedFile} />
    </div>
  );
};

export default Notebook;
