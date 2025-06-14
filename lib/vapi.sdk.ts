import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!token) {
  throw new Error("Missing VAPI token in env");
}

export const vapi = new Vapi(token);
