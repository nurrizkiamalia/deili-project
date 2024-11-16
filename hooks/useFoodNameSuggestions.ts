import { useState } from "react";
import axios from "axios";
import { isUsageAllowed, recordUsage } from "@/utils/aiUsageManager";

export const useFoodNameSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (category: string) => {
    if (!isUsageAllowed("text_gen")) {
      throw new Error("Text generation usage exceeded. Try again in an hour.");
    }
    recordUsage("text_gen");

    if (!category) {
      setError("Category is required to fetch suggestions.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_EDENAI_API_KEY;
      const response = await axios.post(
        "https://api.edenai.run/v2/text/generation",
        {
          providers: ["openai"],
          text: `You are a culinary expert. Suggest 5 traditional and popular food names specifically for the "${category}" category. Ensure that each suggestion includes the word "${category}" in the name and is a well-known dish closely related to "${category}". Please only generate names without any explanation.`,
          model: "gpt-3.5-turbo",
          max_tokens: 150,
          temperature: 0.7,
        },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      const suggestionsText = response.data.openai.generated_text.trim();
      if (suggestionsText) {
        const fetchedSuggestions = suggestionsText
          .split("\n")
          .map((s: string) => s.replace(/^\d+\.\s*/, "").trim());
        setSuggestions(fetchedSuggestions);
      } else {
        setError("No suggestions found.");
      }
    } catch (err: any) {
      console.error("Eden AI API error:", err.response?.data || err.message);
      setError("Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, error, fetchSuggestions };
};
