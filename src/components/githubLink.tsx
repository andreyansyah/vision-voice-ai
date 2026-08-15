export const GitHubLink = () => {
  return (
    <div className="absolute right-0 top-0 z-10 m-24">
      <a
        draggable={false}
        href="https://github.com/andreyansyah/vision-voice-ai"
        rel="noopener noreferrer"
        target="_blank"
        className="cmd-terminal-card block"
        title="Buka Repository GitHub (vision-voice-ai)"
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
            <span className="cmd-dot cmd-dot-red" />
            <span className="cmd-dot cmd-dot-yellow" />
            <span className="cmd-dot cmd-dot-green" />
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
      </a>
    </div>
  );
};
