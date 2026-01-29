import axios from "axios";

export const apiExternal = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_EXTERNAL,
});
