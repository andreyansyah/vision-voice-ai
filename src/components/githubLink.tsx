import { buildUrl } from "@/utils/buildUrl";

export const GitHubLink = () => {
  return (
    <div className="absolute right-0 z-10 m-24">
      <a
        draggable={false}
        href="https://github.com/pixiv/ChatVRM"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="futuristic-github-btn">
          <img
            alt="https://github.com/pixiv/ChatVRM"
            height={18}
            width={18}
            src={buildUrl("/github-mark-white.svg")}
          ></img>
          <div style={{ color: "#ffffff" }}>Fork saya</div>
        </div>
      </a>
    </div>
  );
};
