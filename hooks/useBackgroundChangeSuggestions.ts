"use client";
import { useState } from 'react';
import axios from 'axios';

export const useBackgroundChangeSuggestions = () => {
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const suggestBackgroundChange = async (image: File) => {
    setLoading(true);
    setError(null);

    try {
      // Store the original image
      setOriginalImage(URL.createObjectURL(image));

      // Remove background
      const removeBackgroundFormData = new FormData();
      removeBackgroundFormData.append('files', image);
      const removeBgResponse = await axios.post(
        'https://api.edenai.run/v2/image/background_removal',
        removeBackgroundFormData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EDENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const removedBgImageUrl = removeBgResponse.data.output?.image_url;

      if (!removedBgImageUrl || !removedBgImageUrl.startsWith('http')) {
        throw new Error('Invalid removed background image URL.');
      }

      // Generate appealing backgrounds
      const backgroundPrompts = [
        "Elegant restaurant table setting",
        "Rustic wooden kitchen counter",
        "Colorful abstract food-themed pattern",
        "Soft focus natural outdoor scene"
      ];

      const backgroundPromises = backgroundPrompts.map(prompt => 
        axios.post('https://api.edenai.run/v2/image/generation', 
          { prompt, providers: "stabilityai" },
          {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EDENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const backgroundResponses = await Promise.all(backgroundPromises);
      const backgroundUrls = backgroundResponses.map(response => response.data.stabilityai.items[0].image_url);

      // Combine removed background image with new backgrounds
      const combinedImagePromises = backgroundUrls.map(bgUrl => 
        axios.post('https://api.edenai.run/v2/image/image_to_image',
          { 
            image_url: removedBgImageUrl,
            background_image_url: bgUrl,
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EDENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const combinedImageResponses = await Promise.all(combinedImagePromises);
      const suggestedImageUrls = combinedImageResponses.map(response => response.data.stabilityai.items[0].image_url);

      setSuggestedImages(suggestedImageUrls);
    } catch (err: any) {
      console.error('Image processing error:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { suggestedImages, originalImage, loading, error, suggestBackgroundChange };
};