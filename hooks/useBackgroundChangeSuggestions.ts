// hooks/useBackgroundChangeSuggestions.ts

import { useState } from "react";
import axios from "axios";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

export const useBackgroundChangeSuggestions = () => {
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isolatedForeground, setIsolatedForeground] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const removeBackground = async (image: File) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_EDENAI_API_KEY;
      if (!apiKey) throw new Error("API key is not configured");

      const imageUrl = await uploadImageToCloudinary(image);
      const response = await axios.post(
        "https://api.edenai.run/v2/image/background_removal",
        { providers: "sentisight", file_url: imageUrl },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      const resultUrl = response.data.sentisight?.image_resource_url;
      if (!resultUrl) throw new Error("Failed to retrieve isolated foreground image.");
      
      setIsolatedForeground(resultUrl);
      setOriginalImage(imageUrl);
      return resultUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Background removal failed.";
      setError(errorMessage);
      throw err;
    }
  };

  const generateBackground = async (prompt: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_EDENAI_API_KEY;
      if (!apiKey) throw new Error("API key is not configured");

      const response = await axios.post(
        "https://api.edenai.run/v2/image/generation",
        { providers: "replicate", text: prompt, resolution: "512x512" },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      const generatedImageUrl = response.data.replicate.items[0]?.image_resource_url;
      if (!generatedImageUrl) throw new Error("No image URL in the response items");

      setSuggestedImages([generatedImageUrl]);
      return generatedImageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Background generation failed.";
      setError(errorMessage);
      throw err;
    }
  };

  const suggestBackgroundChange = async (image: File, prompt: string) => {
    setLoading(true);
    setError(null);
    setSuggestedImages([]);

    try {
      const foregroundUrl = await removeBackground(image);
      const backgroundUrl = await generateBackground(prompt);
      return { foregroundUrl, backgroundUrl };
    } catch (err) {
      console.error("Error during background processing:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    suggestedImages,
    isolatedForeground,
    originalImage,
    loading,
    error,
    suggestBackgroundChange,
  };
};
