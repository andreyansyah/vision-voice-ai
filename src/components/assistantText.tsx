export const AssistantText = ({ message }: { message: string }) => {
  return (
    <div className="absolute bottom-0 left-0 mb-104 w-full z-10">
      <div className="mx-auto max-w-3xl w-full px-16 md:px-24">
        <div className="futuristic-subtitle-box">
          <div className="futuristic-subtitle-header">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            KARAKTER
          </div>
          <div className="futuristic-subtitle-text">
            <div className="line-clamp-4" style={{ color: "#ffffff" }}>
              {message.replace(/\[([a-zA-Z]*?)\]/g, "")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
