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
            {/* Header */}
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
                cmd.exe - Vision Voice AI System Console [MAXIMIZED MODE]
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

            {/* Body */}
            <div className="cmd-terminal-body !p-24 !text-sm !leading-relaxed">
              <div className="cmd-line mb-4">
                <span className="cmd-path">C:\VISION_AI&gt;</span>
                <span className="cmd-output text-white font-bold">sys --info --verbose</span>
              </div>

              <div className="text-neutral-400 mb-2">
                ========================================================================
              </div>
              <div className="text-emerald-400 font-extrabold mb-1">
                [SYS] APPLICATION : VISION VOICE AI (V1.0.0 RELEASE)
              </div>
              <div className="text-white font-semibold mb-1">
                [SYS] ARCHITECTURE: NEXT.JS 13 (REACT 18 / THREE.JS 3D AVATAR ENGINE)
              </div>
              <div className="text-white font-semibold mb-2">
                [SYS] ENVIRONMENT : ONLINE & READY (SUPPORT LOCAL & CPANEL PASSENGER)
              </div>
              <div className="text-neutral-400 mb-2">
                ------------------------------------------------------------------------
              </div>
              <div className="text-rose-400 font-bold mb-1">
                [AI]  LLM ENGINE  : GEMINI 3 FLASH PREVIEW (/v1/chat/completions)
              </div>
              <div className="text-cyan-400 font-bold mb-1">
                [TTS] AUDIO VOICE : GEMINI 2.5 FLASH TTS (PUCK MALE / 24KHZ HIGH-RES)
              </div>
              <div className="text-amber-300 font-bold mb-2">
                [VAD] AUTO LIVE   : CONTINUOUS SPEECH RECOGNITION + STRICT ECHO FILTER
              </div>
              <div className="text-neutral-400 mb-2">
                ------------------------------------------------------------------------
              </div>
              <div className="text-white font-bold mb-3">
                [REPO] GITHUB     : https://github.com/andreyansyah/vision-voice-ai
              </div>
              <div className="text-neutral-400 mb-4">
                ========================================================================
              </div>

              <div className="cmd-line mb-6">
                <span className="cmd-path">C:\VISION_AI&gt;</span>
                <span className="cmd-output text-white">git clone https://github.com/andreyansyah/vision-voice-ai.git</span>
                <span className="cmd-cursor !w-2.5 !h-5" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-12 mt-6 pt-16 border-t border-white/10">
                <button
                  className="px-20 py-10 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    window.open("https://github.com/andreyansyah/vision-voice-ai", "_blank");
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Buka Repository GitHub
                </button>
                <button
                  className="px-20 py-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs tracking-wider uppercase transition-all border border-white/10 cursor-pointer"
                  onClick={() => setIsMaximized(false)}
                >
                  ✖ Restore Jendela
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
