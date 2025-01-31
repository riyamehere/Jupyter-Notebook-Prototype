import React, { useState } from "react";
import { executePythonCode } from "../services/api";
import {Textarea} from "@heroui/input";
import {Button} from "@heroui/react";

const CodeCell: React.FC = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    try {
      const result = await executePythonCode(code);
      setOutput(result);
    } catch (error) {
      setOutput("Error executing code.");
    }
    console.log('hey')
  };

  return (
    <div className="border p-4 my-2">
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write Python code here..."
      />
      <Button onClick={handleRun} color="primary" className="my-2 bg-green-300 rounded-md cursor-pointer">
        Run
      </Button>
      {output && <pre className="bg-gray-100 p-2">{output}</pre>}
    </div>
  );
};

export default CodeCell;
