import { Message } from "../messages/messages";

export async function getChatResponse(messages: Message[], apiKey: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: apiKey,
      messages: messages,
      stream: false,
    }),
  });

  if (res.status !== 200) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || "Gagal mendapatkan respon dari AI.");
  }

  const data = await res.json();
  return { message: data.message };
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: apiKey,
      messages: messages,
      stream: true,
    }),
  });

  if (res.status !== 200) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || "Gagal mendapatkan respon dari AI.");
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("Gagal membaca data stream dari AI.");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value, { stream: true });
          buffer += data;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith("data: ")) {
              const jsonStr = cleanLine.replace("data: ", "").trim();
              if (jsonStr === "[DONE]") {
                return;
              }
              try {
                const json = JSON.parse(jsonStr);
                const messagePiece =
                  json.choices?.[0]?.delta?.content ||
                  json.choices?.[0]?.message?.content ||
                  json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!!messagePiece) {
                  controller.enqueue(messagePiece);
                }
              } catch (e) {
                console.error("Error parsing chunk", e, jsonStr);
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
