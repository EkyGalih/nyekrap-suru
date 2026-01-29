import axios from "axios";

export async function zenrowsFetch(targetUrl: string) {
  if (!process.env.ZENROWS_API_KEY) {
    throw new Error("ZENROWS_API_KEY belum diset di ENV");
  }

  const zenUrl = `https://api.zenrows.com/v1/`;

  const response = await axios.get<string>(zenUrl, {
    params: {
      url: targetUrl,
      apikey: process.env.ZENROWS_API_KEY,
      js_render: "true", // optional (buat web berat)
    },
    timeout: 20000,
  });

  return response.data;
}