import { useState, useCallback } from "react";
import { Link } from "./link";

type Props = {
  openAiKey: string;
  koeiroMapKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  onChangeKoeiromapKey: (koeiromapKey: string) => void;
};
export const Introduction = ({
  openAiKey,
  koeiroMapKey,
  onChangeAiKey,
  onChangeKoeiromapKey,
}: Props) => {
  const [opened, setOpened] = useState(false);

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleKoeiromapKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeKoeiromapKey(event.target.value);
    },
    [onChangeKoeiromapKey]
  );

  return opened ? (
    <div className="absolute z-40 w-full h-full px-24 py-40 bg-black/30 font-M_PLUS_2">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary ">
            Tentang Aplikasi Ini
          </div>
          <div>
            Nikmati percakapan dengan karakter 3D langsung di web browser Anda menggunakan mikrofon, input teks, dan sintesis suara. Anda juga dapat mengubah karakter (VRM), mengatur kepribadian, serta menyesuaikan suara.
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Pengenalan Teknologi
          </div>
          <div>
            Aplikasi ini menggunakan
            <Link
              url={"https://github.com/pixiv/three-vrm"}
              label={"@pixiv/three-vrm"}
            />
             untuk menampilkan dan mengontrol model 3D,
            <Link
              url={
                "https://openai.com/blog/introducing-chatgpt-and-whisper-apis"
              }
              label={"ChatGPT API"}
            />
             untuk menghasilkan percakapan, dan
            <Link url={"https://koemotion.rinna.co.jp/"} label={"Koemotion"} />
             dengan
            <Link
              url={
                "https://developers.rinna.co.jp/product/#product=koeiromap-free"
              }
              label={"Koeiromap API"}
            />
             untuk sintesis suara. Untuk informasi lebih lanjut, silakan baca
            <Link
              url={"https://inside.pixiv.blog/2023/04/28/160000"}
              label={"artikel penjelasan teknis ini"}
            />
            .
          </div>
          <div className="my-16">
            Kode sumber demo ini dipublikasikan di GitHub. Silakan mencoba memodifikasi atau mengubahnya secara bebas!
            <br />
            Repositori:
            <Link
              url={"https://github.com/pixiv/ChatVRM"}
              label={"https://github.com/pixiv/ChatVRM"}
            />
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Ketentuan Penggunaan
          </div>
          <div>
            Mohon tidak secara sengaja memicu ucapan diskriminatif, kekerasan, atau merendahkan orang tertentu. Selain itu, saat mengganti karakter menggunakan model VRM, silakan patuhi ketentuan penggunaan dari model tersebut.
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Sintesis Suara (TTS)
          </div>
          <div className="my-4 text-primary">
            Sintesis suara gratis dan otomatis menggunakan Google TTS (tidak memerlukan kunci API).
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Kunci API Gemini
          </div>
          <input
            type="text"
            placeholder="AIzaSy..."
            value={openAiKey}
            onChange={handleAiKeyChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
          <div>
            Kunci API dapat diperoleh di{" "}
            <Link
              url="https://aistudio.google.com/"
              label="Google AI Studio"
            />
            . Silakan masukkan kunci API Gemini yang diperoleh ke dalam formulir.
          </div>
          <div className="my-16">
            Gemini API diakses langsung dari browser Anda. Kunci API dan konten percakapan tidak disimpan di server Pixiv.
            <br />
            ※ Model yang digunakan adalah Gemini 1.5 Flash.
          </div>
        </div>
        <div className="my-24">
          <button
            onClick={() => {
              setOpened(false);
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            Masukkan Kunci API dan Mulai
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
