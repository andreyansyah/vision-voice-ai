import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey =
    req.body.apiKey ||
    process.env.CUSTOM_API_KEY ||
    process.env.KOBOI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPEN_AI_KEY ||
    "sk-LIyUDxzxPYUgj61n07NAig";

  if (!apiKey) {
    res.status(400).json({
      message:
        "Kunci API Custom Provider belum dimasukkan. Silakan masukkan Kunci API Anda di menu Pengaturan.",
    });
    return;
  }

  const messages = req.body.messages || [];
  const isStream = req.body.stream === true;

  const chatModels = [
    "gemini/gemini-3-flash-preview",
    "gemini-3-flash-preview",
    "openai/gpt-4o-mini",
  ];

  for (const model of chatModels) {
    try {
      console.log(`⚡ Memproses Chat AI via Custom Provider (${model})...`);
      const response = await fetch("https://lite.koboillm.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: isStream,
        }),
      });

      if (response.status === 200) {
        if (isStream) {
          const reader = response.body?.getReader();
          if (!reader) {
            res
              .status(500)
              .json({ message: "Gagal membaca data stream dari Custom Provider API." });
            return;
          }

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          });

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          } catch (err) {
            console.error("Stream pipe error:", err);
          } finally {
            reader.releaseLock();
            res.end();
          }
          return;
        } else {
          const data = await response.json();
          const messageContent =
            data.choices?.[0]?.message?.content ||
            "Terjadi kesalahan pada respon Custom Provider";
          res.status(200).json({ message: messageContent });
          return;
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.error(`⚠️ Chat Model ${model} Error (${response.status}):`, errJson);
      }
    } catch (e: any) {
      console.error(`⚠️ Chat Model ${model} Exception:`, e?.message || e);
    }
  }

  res.status(500).json({
    message: "Gagal menghubungkan ke Custom Provider Chat API. Pastikan Kunci API valid.",
  });
}
