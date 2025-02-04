const JUPYTER_BASE_URL = "http://localhost:8000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN; // Replace with your generated token

export const executePythonCode = async (code: string) => {
  // Step 1: Create a kernel

  const kernelResponse = await fetch(`${JUPYTER_BASE_URL}/user/admin/api/kernels`, {
    method: "POST", // Change to POST method
    headers: {
      "Authorization": `token ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "name": "python3", 
    }),
});
const kernelData = await kernelResponse.json();
const kernelId = kernelData.id;

console.log(kernelId)

  // Step 2: Open WebSocket connection to kernel
  const wsUrl = `${JUPYTER_BASE_URL}/user/admin/api/kernels/${kernelId}/channels`;
  const ws = new WebSocket(wsUrl);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      // Step 3: Send execute request through WebSocket
      const executeRequest = {
        header: {
          msg_id: "execute_request",
          username: "admin",
          session: kernelId,
          msg_type: "execute_request",
        },
        content: {
          code,
          silent: false,
          store_history: true,
          user_expressions: {},
          allow_stdin: false,
        },
        metadata: {},
        parent_header: {},
      };

      // Send code execution request to kernel
      ws.send(JSON.stringify(executeRequest));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Look for "execute_reply" message type
      if (message.header.msg_type === "execute_reply") {
        if (message.content.status === "ok") {
          // Execution successful
          resolve(message.content);
        } else {
          // Execution failed
          reject("Execution failed");
        }

        // Close WebSocket connection after execution
        ws.close();
      }
    };

    ws.onerror = (error) => {
      reject(error);
      ws.close();
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  });
};
