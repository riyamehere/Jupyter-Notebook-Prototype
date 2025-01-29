import React, { useState } from "react";
import CodeCell from "./CodeCell";
import { Button } from "@nextui-org/react";

const FileEditor: React.FC<{ selectedFile: string | null }> = ({
  selectedFile,
}) => {
  const [cells, setCells] = useState<number[]>([]);

  if (!selectedFile) return <div className="p-4">Select a file to start coding.</div>;

  const addCell = () => {
    setCells([...cells, cells.length + 1]);
  };

  return (
    <div className="p-4 w-3/4">
      <h2 className="text-lg font-semibold">{selectedFile}</h2>
      <Button onClick={addCell} className="my-2">
        Add Code Cell
      </Button>
      {cells.map((id) => (
        <CodeCell key={id} />
      ))}
    </div>
  );
};

export default FileEditor;
