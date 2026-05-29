import axios from "axios";

export const generateTag = async (content) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You summarize notes clearly.",
          },
          {
            role: "user",
            content: `Summarize this note:\n\n${content}`,
          },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        //The request automatically fails after 10 seconds.
        timeout: 10000,
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("Grow API Timeout");
    }
    if (error.response?.status === 429) {
      throw new Error("Grow rate limit exceeded");
    }
    console.log("Groq Api Failed");
  }
};
