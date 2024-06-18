import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // client should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const client = axios.create({
  //baseURL: "https://www.rbrgs.com/api",
  baseURL: getBaseUrl() + "/api",
  // baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
