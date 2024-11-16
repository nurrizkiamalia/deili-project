import { useState } from "react";
import axios from "axios";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { isUsageAllowed, recordUsage } from "@/utils/aiUsageManager";

export const useBackgroundChangeSuggestions = () => {
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isolatedForeground, setIsolatedForeground] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const removeBackground = async (image: File) => {
    if (!isUsageAllowed("bg_removal")) {
      throw new Error("Background removal usage exceeded. Try again in an hour.");
    }
    recordUsage("bg_removal");

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
      if (!resultUrl) {
        console.warn("Background removal failed. Falling back to original image.");
        return imageUrl;
      }

      return resultUrl;
    } catch (err) {
      console.error("Error during background removal:", err);
      return null;
    }
  };

  const generateBackground = async (prompt: string) => {
    if (!isUsageAllowed("image_gen")) {
      throw new Error("Image generation usage exceeded. Try again in an hour.");
    }
    recordUsage("image_gen");

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
      if (!foregroundUrl) {
        console.warn("Skipping background removal. Using original image.");
        return { foregroundUrl: null, backgroundUrl: null };
      }

      const backgroundUrl = await generateBackground(prompt);
      return { foregroundUrl, backgroundUrl };
    } catch (err) {
      console.error("Error during background processing:", err);
      return null;
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
