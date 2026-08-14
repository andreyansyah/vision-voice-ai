import { IconButton } from "./iconButton";

type Props = {
  userMessage: string;
  isMicRecording: boolean;
  isChatProcessing: boolean;
  isAutoLiveMode: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickSendButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickAutoLiveButton: () => void;
};

export const MessageInput = ({
  userMessage,
  isMicRecording,
  isChatProcessing,
  isAutoLiveMode,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
  onClickAutoLiveButton,
}: Props) => {
  return (
    <div className="futuristic-bar-wrapper">
      <div className="mx-auto max-w-3xl">
        {/* Dynamic Voice Status Notification Badge */}
        <div className="voice-status-badge-container">
          {isChatProcessing ? (
            <div className="voice-status-badge status-ai-speaking">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              🤖 Karakter Sedang Bicara... (Mic Dimute)
            </div>
          ) : isAutoLiveMode ? (
            <div className="voice-status-badge status-user-turn">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              🎙️ Giliran Anda! Silakan Bicara... (Auto Listener Aktif)
            </div>
          ) : isMicRecording ? (
            <div className="voice-status-badge status-listening">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              🎙️ Silakan Bicara... (Mic Mendengarkan)
            </div>
          ) : null}
        </div>

        <div className="futuristic-input-container">
          <IconButton
            iconName="24/Microphone"
            className="futuristic-btn futuristic-btn-mic"
            isProcessing={isMicRecording && !isAutoLiveMode}
            disabled={isChatProcessing}
            onClick={onClickMicButton}
          />
          <input
            type="text"
            placeholder={
              isChatProcessing
                ? "Tunggu karakter selesai bicara..."
                : isAutoLiveMode
                ? "🎙️ Auto Mode Aktif... Bicara kapan saja!"
                : "Ketik apa yang ingin Anda tanyakan..."
            }
            onChange={onChangeUserMessage}
            disabled={isChatProcessing}
            className="futuristic-input-field"
            value={userMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isChatProcessing && userMessage) {
                onClickSendButton(e as any);
              }
            }}
          />
          <IconButton
            iconName="24/Send"
            className="futuristic-btn futuristic-btn-send"
            isProcessing={isChatProcessing}
            disabled={isChatProcessing || !userMessage}
            onClick={onClickSendButton}
          />
          {/* Futuristic Auto Live Mode Button (Right of Send Button) */}
          <button
            type="button"
            title={
              isAutoLiveMode
                ? "Matikan Mode Auto Listener (Gemini Live)"
                : "Aktifkan Mode Auto Listener (Gemini Live - Ngobrol Otomatis)"
            }
            className={`futuristic-btn-live ${isAutoLiveMode ? "active" : ""}`}
            onClick={onClickAutoLiveButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 10v3" />
              <path d="M6 6v11" />
              <path d="M10 3v18" />
              <path d="M14 8v7" />
              <path d="M18 5v13" />
              <path d="M22 10v3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
