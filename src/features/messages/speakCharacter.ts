import { wait } from "@/utils/wait";
import { synthesizeVoiceApi } from "./synthesizeVoice";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";
import { Talk } from "./messages";

export class SpeakQueue {
  private activeCount = 0;
  private prevFetchPromise: Promise<unknown> = Promise.resolve();
  private prevSpeakPromise: Promise<unknown> = Promise.resolve();
  private lastTime = 0;

  public speak(
    screenplay: Screenplay,
    viewer: Viewer,
    koeiroApiKey: string,
    onStart?: () => void,
    onComplete?: () => void
  ): Promise<unknown> {
    this.activeCount++;

    const fetchPromise = this.prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - this.lastTime < 500) {
        await wait(500 - (now - this.lastTime));
      }

      const buffer = await fetchAudio(screenplay.talk, koeiroApiKey).catch(
        (err) => {
          console.error("fetchAudio Error:", err);
          return null;
        }
      );
      this.lastTime = Date.now();
      return buffer;
    });

    this.prevFetchPromise = fetchPromise;

    const speakPromise = Promise.all([fetchPromise, this.prevSpeakPromise]).then(
      async ([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          this.activeCount = Math.max(0, this.activeCount - 1);
          return;
        }
        try {
          await viewer.model?.speak(audioBuffer, screenplay);
        } finally {
          this.activeCount = Math.max(0, this.activeCount - 1);
        }
      }
    );

    this.prevSpeakPromise = speakPromise;

    speakPromise.then(() => {
      onComplete?.();
    });

    return speakPromise;
  }

  public async waitUntilFinished(): Promise<void> {
    while (this.activeCount > 0) {
      await this.prevSpeakPromise.catch(() => null);
      await wait(100);
    }
  }

  public isSpeaking(): boolean {
    return this.activeCount > 0;
  }
}

export const speakQueue = new SpeakQueue();

export const speakCharacter = (
  screenplay: Screenplay,
  viewer: Viewer,
  koeiroApiKey: string,
  onStart?: () => void,
  onComplete?: () => void
) => speakQueue.speak(screenplay, viewer, koeiroApiKey, onStart, onComplete);

export const fetchAudio = async (
  talk: Talk,
  apiKey: string
): Promise<ArrayBuffer> => {
  const ttsVoice = await synthesizeVoiceApi(
    talk.message,
    talk.speakerX,
    talk.speakerY,
    talk.style,
    apiKey
  );
  const url = ttsVoice.audio;

  if (url == null) {
    throw new Error("Something went wrong");
  }

  const resAudio = await fetch(url);
  const buffer = await resAudio.arrayBuffer();
  return buffer;
};
