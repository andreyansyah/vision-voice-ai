import { useCallback, useContext, useEffect, useState } from "react";
import { wait } from "@/utils/wait";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter, speakQueue } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { KoeiroParam, DEFAULT_PARAM } from "@/features/constants/koeiroParam";
import { getChatResponseStream } from "@/features/chat/geminiChat";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";

const DEFAULT_GEMINI_KEY =
  "sk-LIyUDxzxPYUgj61n07NAig";

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState(DEFAULT_GEMINI_KEY);
  const [koeiromapKey, setKoeiromapKey] = useState("");
  const [koeiroParam, setKoeiroParam] = useState<KoeiroParam>(DEFAULT_PARAM);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("chatVRMParams")) {
      const params = JSON.parse(
        window.localStorage.getItem("chatVRMParams") as string
      );
      const loadedPrompt = params.systemPrompt ?? SYSTEM_PROMPT;
      if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(loadedPrompt)) {
        setSystemPrompt(SYSTEM_PROMPT);
      } else {
        setSystemPrompt(loadedPrompt);
      }
      setKoeiroParam(params.koeiroParam ?? DEFAULT_PARAM);
      setChatLog(params.chatLog ?? []);
    }
  }, []);

  useEffect(() => {
    process.nextTick(() =>
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ systemPrompt, koeiroParam, chatLog })
      )
    );
  }, [systemPrompt, koeiroParam, chatLog]);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

  /**
   * 文ごとに音声を直列でリクエストしながら再生する
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      speakCharacter(screenplay, viewer, openAiKey, onStart, onEnd);
    },
    [viewer, openAiKey]
  );

  /**
   * アシスタントとの会話を行う
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      if (!openAiKey) {
        setAssistantMessage("Kunci API Gemini belum dimasukkan");
        return;
      }

      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      // ユーザーの発言を追加して表示
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      // Chat GPTへ
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messageLog,
      ];

      const stream = await getChatResponseStream(messages, openAiKey).catch(
        (e) => {
          console.error(e);
          alert(e?.message || "Terjadi kesalahan saat menghubungkan ke AI.");
          return null;
        }
      );
      if (stream == null) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
      let lastSpeakPromise: Promise<unknown> | null = null;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          receivedMessage += value;

          // 返答内容のタグ部分の検出
          const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
            receivedMessage = receivedMessage.slice(tag.length);
          }

          // Potong teks per kalimat utuh (tanda titik, seru, tanya, newline)
          const sentenceMatch = receivedMessage.match(
            /^(.+?[.!?。．！？\n])/
          );
          if (sentenceMatch && sentenceMatch[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage
              .slice(sentence.length)
              .trimStart();

            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            const aiText = `${tag} ${sentence}`;
            const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += sentence;

            const currentAssistantMessage = sentences.join(" ");
            lastSpeakPromise = handleSpeakAi(aiTalks[0], () => {
              setAssistantMessage(currentAssistantMessage);
            });
          }
        }

        // Proses sisa teks jika ada yang belum berakhiran tanda baca
        if (receivedMessage.trim()) {
          const sentence = receivedMessage.trim();
          sentences.push(sentence);
          const aiText = `${tag} ${sentence}`;
          const aiTalks = textsToScreenplay([aiText], koeiroParam);
          aiTextLog += (aiTextLog ? " " : "") + sentence;
          const currentAssistantMessage = sentences.join(" ");
          lastSpeakPromise = handleSpeakAi(aiTalks[0], () => {
            setAssistantMessage(currentAssistantMessage);
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      // Tunggu hingga SELURUH antrean pengunduhan TTS dan pemutaran audio karakter selesai 100%
      await speakQueue.waitUntilFinished();
      await wait(800); // 800ms margin jeda hening aman agar mic tidak menangkap gema speaker

      // Bersihkan tag emosi sebelum menyimpan ke riwayat percakapan
      const cleanAiContent = aiTextLog.replace(/^\[(.*?)\]\s*/, "").trim();
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: cleanAiContent || aiTextLog || "..." },
      ];

      setChatLog(messageLogAssistant);
      setChatProcessing(false);
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey, koeiroParam]
  );

  return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      <Introduction
        openAiKey={openAiKey}
        koeiroMapKey={koeiromapKey}
        onChangeAiKey={setOpenAiKey}
        onChangeKoeiromapKey={setKoeiromapKey}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
        lastAssistantMessage={assistantMessage}
      />
      <Menu
        openAiKey={openAiKey}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        koeiromapKey={koeiromapKey}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeKoeiromapParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
        onChangeKoeiromapKey={setKoeiromapKey}
      />
      <GitHubLink />
    </div>
  );
}
