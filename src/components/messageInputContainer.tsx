import { MessageInput } from "@/components/messageInput";
import { useState, useEffect, useCallback, useRef } from "react";

type Props = {
  isChatProcessing: boolean;
  onChatProcessStart: (text: string) => void;
  lastAssistantMessage?: string;
};

/**
 * Smart Echo Filter: Distinguishes pure speaker echoes from genuine user replies.
 * Examples:
 *   1. assistant: "Wih, mantap banget, bentar lagi kelar nih kerjaan Pak Bos yang keren itu!"
 *      user mic:  "bentar lagi kelar nih kerjaan Pak Bos"
 *      Output: "" (100% contiguous clone -> PURE ECHO DISCARDED)
 *
 *   2. assistant: "Wih, mantap banget, bentar lagi kelar nih kerjaan Pak Bos yang keren itu!"
 *      user mic:  "yoi yoi bentar lagi kelar nih Bro"
 *      Output: "yoi yoi bentar lagi kelar nih Bro" (Genuine user reply -> PASSED & SENT)
 */
function stripAssistantEchoPrefix(userText: string, assistantText?: string): string {
  if (!userText) return "";
  const cleanUser = userText.trim();
  if (!assistantText) return cleanUser;

  const cleanAssistant = assistantText.trim();
  if (!cleanAssistant) return cleanUser;

  const lowerUser = cleanUser.toLowerCase();
  const lowerAssistant = cleanAssistant.toLowerCase();

  // Normalize user and assistant words (remove punctuation)
  const userWords = lowerUser
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const assistantWords = lowerAssistant
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (userWords.length === 0) return "";
  if (assistantWords.length === 0) return cleanUser;

  // Search for longest contiguous sequence of userWords inside assistantWords
  let bestMatchLength = 0;
  let bestMatchUserStart = 0;

  for (let userStart = 0; userStart < userWords.length; userStart++) {
    for (let astStart = 0; astStart < assistantWords.length; astStart++) {
      let count = 0;
      while (
        astStart + count < assistantWords.length &&
        userStart + count < userWords.length &&
        assistantWords[astStart + count] === userWords[userStart + count]
      ) {
        count++;
      }
      if (count > bestMatchLength) {
        bestMatchLength = count;
        bestMatchUserStart = userStart;
      }
    }
  }

  // Pure echo condition: 75%+ of user speech is a contiguous verbatim clone of character sentence
  const matchRatio = bestMatchLength / userWords.length;
  if (bestMatchLength >= 3 && matchRatio >= 0.75) {
    console.log(`🚫 Membuang gema murni speaker (${bestMatchLength}/${userWords.length} kata cocok berurutan): "${cleanUser}"`);
    return "";
  }

  // Echo prefix condition: Speech STARTS with contiguous character echo, but user added new words at the end
  if (bestMatchUserStart === 0 && bestMatchLength >= 3 && userWords.length - bestMatchLength >= 2) {
    const originalUserWords = cleanUser.split(/\s+/);
    const remainingText = originalUserWords.slice(bestMatchLength).join(" ").trim();
    if (remainingText) {
      console.log(`✂️ Memotong prefix gema (${bestMatchLength} kata). Menyimpan balasan asli pengguna: "${remainingText}"`);
      return remainingText;
    }
  }

  return cleanUser;
}

export const MessageInputContainer = ({
  isChatProcessing,
  onChatProcessStart,
  lastAssistantMessage = "",
}: Props) => {
  const [userMessage, setUserMessage] = useState("");
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isAutoLiveMode, setIsAutoLiveMode] = useState(false);

  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(isChatProcessing);
  const isAutoLiveModeRef = useRef(isAutoLiveMode);
  const lastSpeechTextRef = useRef("");
  const lastAssistantMessageRef = useRef(lastAssistantMessage);

  useEffect(() => {
    isProcessingRef.current = isChatProcessing;
  }, [isChatProcessing]);

  useEffect(() => {
    isAutoLiveModeRef.current = isAutoLiveMode;
  }, [isAutoLiveMode]);

  useEffect(() => {
    lastAssistantMessageRef.current = lastAssistantMessage;
  }, [lastAssistantMessage]);

  // Handle Speech Recognition Result with Precise Echo Filtering & VAD
  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      const cleanUserText = stripAssistantEchoPrefix(currentTranscript, lastAssistantMessageRef.current);

      setUserMessage(cleanUserText);
      lastSpeechTextRef.current = cleanUserText;

      // Clear any pending silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // Jika ucapan murni pengguna ada isinya, jalankan timer hening 1.8s untuk auto send
      if (isAutoLiveModeRef.current && cleanUserText.trim()) {
        silenceTimerRef.current = setTimeout(() => {
          const finalSpeech = stripAssistantEchoPrefix(
            lastSpeechTextRef.current,
            lastAssistantMessageRef.current
          ).trim();

          if (finalSpeech && !isProcessingRef.current) {
            console.log("🎙️ Auto Listener: Hening 1.8s. Mengirim ucapan pengguna:", finalSpeech);
            onChatProcessStart(finalSpeech);
          }
        }, 1800);
      }
    },
    [onChatProcessStart]
  );

  // Function to create a fresh SpeechRecognition instance and start recording reliably
  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.removeEventListener("result", handleRecognitionResult);
        speechRecognitionRef.current.removeEventListener("end", handleRecognitionEndInternal);
        speechRecognitionRef.current.abort();
      }
    } catch (e) {}

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.addEventListener("result", handleRecognitionResult);
    recognition.addEventListener("end", handleRecognitionEndInternal);

    speechRecognitionRef.current = recognition;

    try {
      recognition.start();
      setIsMicRecording(true);
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }
  }, [handleRecognitionResult]);

  // Internal end listener to restart if unexpectedly stopped
  function handleRecognitionEndInternal() {
    if (isAutoLiveModeRef.current && !isProcessingRef.current) {
      setTimeout(() => {
        if (isAutoLiveModeRef.current && !isProcessingRef.current) {
          startListening();
        }
      }, 100);
    } else {
      setIsMicRecording(false);
    }
  }

  // Manual Mic Button click handler
  const handleClickMicButton = useCallback(() => {
    if (isMicRecording || isAutoLiveMode) {
      setIsAutoLiveMode(false);
      isAutoLiveModeRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        speechRecognitionRef.current?.abort();
      } catch (e) {}
      setIsMicRecording(false);
      return;
    }

    startListening();
  }, [isMicRecording, isAutoLiveMode, startListening]);

  // Toggle Auto Live Mode (Gemini Live Mode)
  const handleClickAutoLiveButton = useCallback(() => {
    const nextState = !isAutoLiveMode;
    setIsAutoLiveMode(nextState);
    isAutoLiveModeRef.current = nextState;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (nextState) {
      // Turn ON Auto Mode: Start fresh listening
      startListening();
    } else {
      // Turn OFF Auto Mode: Stop listening
      try {
        speechRecognitionRef.current?.abort();
      } catch (e) {}
      setIsMicRecording(false);
    }
  }, [isAutoLiveMode, startListening]);

  // Send button click handler
  const handleClickSendButton = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const cleanUserText = stripAssistantEchoPrefix(userMessage, lastAssistantMessageRef.current);
    if (!cleanUserText) {
      setUserMessage("");
      return;
    }
    onChatProcessStart(cleanUserText);
  }, [onChatProcessStart, userMessage]);

function playTurnChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (e) {
    // Ignore audio restrictions
  }
}

  // Manage Mic state when AI starts/finishes processing & speaking
  useEffect(() => {
    if (isChatProcessing) {
      // AI is speaking: MUTE mic so AI voice is not picked up
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        speechRecognitionRef.current?.abort();
      } catch (e) {}
      setIsMicRecording(false);
    } else {
      // AI finished speaking: Clear input buffer, play turn chime, and START FRESH listening
      setUserMessage("");
      lastSpeechTextRef.current = "";

      if (isAutoLiveModeRef.current) {
        playTurnChime();
        setTimeout(() => {
          startListening();
        }, 300);
      }
    }
  }, [isChatProcessing, startListening]);

  return (
    <MessageInput
      userMessage={userMessage}
      isChatProcessing={isChatProcessing}
      isMicRecording={isMicRecording}
      isAutoLiveMode={isAutoLiveMode}
      onChangeUserMessage={(e) => setUserMessage(e.target.value)}
      onClickMicButton={handleClickMicButton}
      onClickSendButton={handleClickSendButton}
      onClickAutoLiveButton={handleClickAutoLiveButton}
    />
  );
};
