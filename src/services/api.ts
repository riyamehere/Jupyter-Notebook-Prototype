const JUPYTER_BASE_URL = "http://localhost:8000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN; // Replace with your generated token

export const executePythonCode = async (code: string) => {
  const response = await fetch(`${JUPYTER_BASE_URL}/user/admin/api/kernels`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${API_TOKEN}`,
    },
  });

  const { id: kernelId } = await response.json();

  const executeRequest = {
    code,
    silent: false,
    store_history: true,
    user_expressions: {},
    allow_stdin: false,
  };

  await fetch(`${JUPYTER_BASE_URL}/hub/user/admin/api/kernels/${kernelId}/channels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${API_TOKEN}`,
    },
    body: JSON.stringify(executeRequest),
  });

  const result = await fetch(`${JUPYTER_BASE_URL}/hub/user/admin/api/kernels/${kernelId}/execute_reply`, {
    headers: {
      Authorization: `token ${API_TOKEN}`,
    },
  });

  const output = await result.json();
  return output.content.execution_state === "idle" ? output.content.status : "Execution failed";
};
