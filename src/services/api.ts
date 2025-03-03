const JUPYTER_BASE_URL = "http://localhost:8000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN; // Ensure this is set in .env

export const executePythonCode = async (code: string) => {
  try {
    // Step 1: Create a new kernel
    // curl -X POST -H "Authorization: token " \
    //  -H "Content-Type: application/json" \
    //  -d '{"name": "python3"}' \
    const kernelResponse = await fetch(`${JUPYTER_BASE_URL}/user/admin/api/kernels`, {
      method: "POST",
      headers: {
        "Authorization": `token ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "python3" }),
    });

    if (!kernelResponse.ok) throw new Error("Failed to create kernel");

    const kernelData = await kernelResponse.json();
    const kernelId = kernelData.id;

    const wsUrl = `${JUPYTER_BASE_URL.replace("http", "ws")}/user/admin/api/kernels/${kernelId}/channels?token=${API_TOKEN}`;
    const ws = new WebSocket(wsUrl);

    return new Promise((resolve, reject) => {
      ws.onopen = () => {

        const executeRequest = {
          header: {
            msg_id: `msg_${Date.now()}`, // Unique ID
            username: "admin",
            session: kernelId,
            msg_type: "execute_request",
            version: "5.3",
          },
          parent_header: {},
          metadata: {},
          content: {
            code,
            silent: false,
            store_history: true,
            user_expressions: {},
            allow_stdin: false,
          },
        };

        ws.send(JSON.stringify(executeRequest));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.msg_type === "error") {
          reject(`Error: ${message.content.ename} - ${message.content.evalue}`);
          ws.close();
        } else if (message.msg_type === "execute_result" || message.msg_type === "stream") {
          resolve(message.content.text || message.content.data["text/plain"]);
          ws.close();
        }
      };

      ws.onerror = (error) => {
        reject(`WebSocket Error: ${error}`);
        ws.close();
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
      };
    });
  } catch (error) {
    console.error("Execution Error:", error);
    throw error;
  }
};
