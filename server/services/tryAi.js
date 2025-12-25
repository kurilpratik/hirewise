import { chat } from "./aiService.js";

(async function run() {
  try {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "Say hello and give a one-line summary of today's date.",
      },
    ];

    const resp = await chat({ messages, temperature: 0.2, max_tokens: 150 });

    const text =
      resp?.choices?.[0]?.message?.content ??
      resp?.choices?.[0]?.text ??
      JSON.stringify(resp, null, 2);

    console.log("Chat response:\n", text);
  } catch (err) {
    console.error("Error calling chat:", err);
    process.exit(1);
  }
})();
