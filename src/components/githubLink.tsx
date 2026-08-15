import { useState } from "react";

export const GitHubLink = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      {/* Top-Right Minimized CMD Terminal Card (Hidden when Maximized) */}
      {!isMaximized && (
        <div className="absolute right-0 top-0 z-10 m-24">
          <div
            draggable={false}
            className="cmd-terminal-card block"
            title="Buka Repository / Klik Tombol Hijau untuk Maximize"
            onClick={() => {
              window.open("https://github.com/andreyansyah/vision-voice-ai", "_blank");
            }}
          >
            {/* CMD Terminal Window Header */}
            <div className="cmd-terminal-header">
              <div className="cmd-terminal-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                cmd.exe - Vision AI
              </div>
              <div className="cmd-terminal-dots">
                <span
                  className="cmd-dot cmd-dot-red hover:scale-125 transition-transform"
                  title="Tutup"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
                <span
                  className="cmd-dot cmd-dot-yellow hover:scale-125 transition-transform"
                  title="Minimize"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
                <span
                  className="cmd-dot cmd-dot-green hover:scale-125 transition-transform cursor-pointer"
                  title="Maksimalkan / Perbesar Jendela CMD ke Tengah"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMaximized(true);
                  }}
                />
              </div>
            </div>

            {/* CMD Terminal Body */}
            <div className="cmd-terminal-body">
              <div className="cmd-line">
                <span className="cmd-path">C:\VISION_AI&gt;</span>
                <span className="cmd-output font-bold text-white">sys --status</span>
              </div>
              <div className="cmd-line text-emerald-400 font-extrabold">
                [SYS] STATUS : ONLINE (READY)
              </div>
              <div className="cmd-line text-white font-bold">
                [AI]  MODEL  : GEMINI-3-FLASH
              </div>
              <div className="cmd-line text-white font-bold">
                [TTS] VOICE  : PUCK (MALE)
              </div>
              <div className="cmd-line mt-1">
                <span className="cmd-path">C:\VISION_AI&gt;</span>
                <span className="cmd-cursor" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maximized Center CMD Modal */}
      {isMaximized && (
        <div
          className="cmd-modal-overlay"
          onClick={() => setIsMaximized(false)}
        >
          <div
            className="cmd-terminal-card-maximized"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CMD Terminal Window Header */}
            <div className="cmd-terminal-header !py-12 !px-20">
              <div className="cmd-terminal-title !text-sm">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                cmd.exe - Vision AI
              </div>
              <div className="cmd-terminal-dots !gap-8">
                <span
                  className="cmd-dot cmd-dot-red !w-3.5 !h-3.5 cursor-pointer hover:scale-125 transition-transform"
                  title="Tutup / Restore"
                  onClick={() => setIsMaximized(false)}
                />
                <span
                  className="cmd-dot cmd-dot-yellow !w-3.5 !h-3.5 cursor-pointer hover:scale-125 transition-transform"
                  title="Minimize"
                  onClick={() => setIsMaximized(false)}
                />
                <span
                  className="cmd-dot cmd-dot-green !w-3.5 !h-3.5 cursor-pointer hover:scale-125 transition-transform"
                  title="Restore Jendela"
                  onClick={() => setIsMaximized(false)}
                />
              </div>
            </div>

            {/* CMD Terminal Body (EXACT SAME TEXT AS MINIMIZED CARD) */}
            <div className="cmd-terminal-body !p-24 !text-base !leading-relaxed">
              <div className="cmd-line mb-3">
                <span className="cmd-path">C:\VISION_AI&gt;</span>
                <span className="cmd-output font-bold text-white">sys --status</span>
              </div>
              <div className="cmd-line text-emerald-400 font-extrabold mb-3">
                [SYS] STATUS : ONLINE (READY)
              </div>
              <div className="cmd-line text-white font-bold mb-3">
                [AI]  MODEL  : GEMINI-3-FLASH
              </div>
              <div className="cmd-line text-white font-bold mb-3">
                [TTS] VOICE  : PUCK (MALE)
              </div>
              <div className="cmd-line mt-4">
                <span className="cmd-path">C:\VISION_AI&gt;</span>
                <span className="cmd-cursor !w-3 !h-5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
