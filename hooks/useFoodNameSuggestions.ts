"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useFoodNameSuggestions = (category: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchTime = useRef<number>(0);
  const cooldownPeriod = 6000;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!category) return;

      const now = Date.now();
      if (now - lastFetchTime.current < cooldownPeriod) {
        setError('Please wait before requesting more suggestions.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          'https://api.edenai.run/v2/text/generation',
          {
            providers: ["openai"],
            text: `You are a culinary expert. Suggest 5 traditional and popular food names specifically for the "${category}" category. Ensure that each suggestion includes the word "${category}" in the name and is a well-known dish closely related to "${category}". please only generate name without any explanation.`,
            model: "gpt-3.5-turbo",
            max_tokens: 150,
            temperature: 0.7,
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EDENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
          }
        );

        const suggestionsText = response.data.openai.generated_text.trim();
        if (suggestionsText) {
          const suggestions = suggestionsText
            .split('\n')
            .map((s: string) => s.replace(/^\d+\.\s*/, '').trim());
          setSuggestions(suggestions);
        } else {
          setError('No suggestions found.');
        }
        lastFetchTime.current = now;
      } catch (err: any) {
        console.error('Eden AI API error:', err.response?.data || err.message);
        if (err.response?.status === 429) {
          setError('Rate limit exceeded. Please try again later.');
        } else if (err.response?.status === 401) {
          setError('Invalid API key. Please check your API key.');
        } else {
          setError('Failed to fetch suggestions');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [category]);

  return { suggestions, loading, error };
};
