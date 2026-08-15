import { buildUrl } from "@/utils/buildUrl";
import Head from "next/head";
export const Meta = () => {
  const title = "Vision AI";
  const description =
    "Nikmati percakapan dengan karakter 3D langsung di web browser Anda menggunakan mikrofon, input teks, dan sintesis suara. Anda juga dapat mengubah karakter (VRM), mengatur kepribadian, serta menyesuaikan suara.";
  const imageUrl = "https://pixiv.github.io/ChatVRM/ogp.png";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};
