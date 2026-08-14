import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  audio: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let message = req.body.message || "";
  let apiKey =
    req.body.apiKey ||
    process.env.KOBOI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPEN_AI_KEY ||
    "sk-LIyUDxzxPYUgj61n07NAig";

  // Hapus tag emosi seperti [happy], [neutral], [angry], [sad], [relaxed]
  message = message.replace(/\[(neutral|happy|angry|sad|relaxed)\]/gi, "").trim();

  if (!message) {
    res.status(400).json({ audio: "" });
    return;
  }

  // Kunci model dan suara laki-laki Gemini agar 100% konsisten pada setiap kalimat
  const targetModel = "gemini-2.5-flash-tts";
  const targetVoice = "Puck";

  try {
    console.log(`⚡ Memproses KoboiLLM TTS (model: ${targetModel}, voice: ${targetVoice})...`);
    const response = await fetch("https://lite.koboillm.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        input: message,
        voice: targetVoice,
      }),
    });

    if (response.status === 200) {
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString("base64");
      const contentType = response.headers.get("content-type") || "audio/wav";
      const audioDataUrl = `data:${contentType};base64,${base64Audio}`;

      console.log(`✅ Berhasil generate suara konsisten KoboiLLM Gemini TTS (${targetVoice})!`);
      res.status(200).json({ audio: audioDataUrl });
      return;
    } else {
      const errText = await response.text().catch(() => "");
      console.error(`⚠️ KoboiLLM TTS ${targetModel} Error (${response.status}):`, errText);
    }
  } catch (err: any) {
    console.error(`⚠️ KoboiLLM TTS Exception:`, err?.message || err);
  }

  res.status(500).json({
    audio: "",
    error: "Gagal memproses KoboiLLM TTS. Pastikan Kunci API valid.",
  });
}
