"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCategory } from "@/hooks/useCategory";
import { useBackgroundChangeSuggestions } from "@/hooks/useBackgroundChangeSuggestions";
import { Category } from "@/types/datatypes";
import { useFoodNameSuggestions } from "@/hooks/useFoodNameSuggestions";
import { getRemainingUses, isUsageAllowed, getUsageKey, getCooldownTime } from "@/utils/aiUsageManager";

interface FormProductProps {
  initialValues: any;
  onSubmit: (values: any) => Promise<void>;
  validationSchema: any;
}

const FormProduct: React.FC<FormProductProps> = ({ initialValues, onSubmit, validationSchema }) => {
  const { categories, loading: loadingCategories, error: errorCategories } = useCategory();
  const { loading: loadingBackground, error: errorBackground, suggestBackgroundChange } = useBackgroundChangeSuggestions();
  const { suggestions, loading: loadingSuggestions, error: errorSuggestions, fetchSuggestions } = useFoodNameSuggestions();

  const [backgroundCommand, setBackgroundCommand] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compositedImage, setCompositedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialValues.category_id || "");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    categories.find((cat) => cat.id.toString() === initialValues.category_id)?.name || ""
  );

  const [remainingTextGen, setRemainingTextGen] = useState<number>(0);
  const [remainingBgRemoval, setRemainingBgRemoval] = useState<number>(0);
  const [remainingImageGen, setRemainingImageGen] = useState<number>(0);

  const [cooldownTextGen, setCooldownTextGen] = useState<number | null>(null);
  const [cooldownBgRemoval, setCooldownBgRemoval] = useState<number | null>(null);
  const [cooldownImageGen, setCooldownImageGen] = useState<number | null>(null);

  useEffect(() => {
    setRemainingTextGen(getRemainingUses("text_gen"));
    setRemainingBgRemoval(getRemainingUses("bg_removal"));
    setRemainingImageGen(getRemainingUses("image_gen"));

    setCooldownTextGen(getCooldownTime("text_gen"));
    setCooldownBgRemoval(getCooldownTime("bg_removal"));
    setCooldownImageGen(getCooldownTime("image_gen"));
  }, []);

  const updateRemainingUses = () => {
    setRemainingTextGen(getRemainingUses("text_gen"));
    setRemainingBgRemoval(getRemainingUses("bg_removal"));
    setRemainingImageGen(getRemainingUses("image_gen"));

    setCooldownTextGen(getCooldownTime("text_gen"));
    setCooldownBgRemoval(getCooldownTime("bg_removal"));
    setCooldownImageGen(getCooldownTime("image_gen"));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategoryId(selectedCategoryId);

    const selectedCategory = categories.find((cat) => cat.id.toString() === selectedCategoryId);
    if (selectedCategory) {
      setSelectedCategoryName(selectedCategory.name);
      setFieldValue("category_id", selectedCategoryId);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!isUsageAllowed("text_gen")) {
      const minutesRemaining = Math.ceil((cooldownTextGen || 0) / 60000);
      alert(`Text generation limit reached. Try again in ${minutesRemaining} minutes.`);
      return;
    }
    await fetchSuggestions(selectedCategoryName);
    updateRemainingUses();
  };

  const handleBackgroundChange = async () => {
    if (!isUsageAllowed("bg_removal")) {
      const minutesRemaining = Math.ceil((cooldownBgRemoval || 0) / 60000);
      alert(`Background removal limit reached. Try again in ${minutesRemaining} minutes.`);
      return;
    }

    if (!imageFile || !backgroundCommand.trim()) {
      console.error("Image file and prompt are required.");
      return;
    }

    try {
      const { foregroundUrl, backgroundUrl } = (await suggestBackgroundChange(imageFile, backgroundCommand)) || {};
      if (!foregroundUrl && !backgroundUrl) {
        console.warn("No background change applied. Using the original image.");
        setCompositedImage(URL.createObjectURL(imageFile));
        return;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const foreground = new Image();
        const background = new Image();

        foreground.crossOrigin = "anonymous";
        background.crossOrigin = "anonymous";

        background.src = backgroundUrl || "";
        foreground.src = foregroundUrl || URL.createObjectURL(imageFile);

        background.onload = () => {
          canvas.width = background.width;
          canvas.height = background.height;

          ctx?.drawImage(background, 0, 0, canvas.width, canvas.height);

          foreground.onload = () => {
            const scaleFactor = 0.8;
            const xOffset = (canvas.width - foreground.width * scaleFactor) / 2;
            const yOffset = (canvas.height - foreground.height * scaleFactor) / 2;

            ctx?.drawImage(foreground, xOffset, yOffset, foreground.width * scaleFactor, foreground.height * scaleFactor);
            setCompositedImage(canvas.toDataURL("image/png"));
          };
        };
      }
    } catch (err) {
      console.error("Error generating composite image:", err);
    }
    updateRemainingUses();
  };

  const handleSaveProduct = async (values: any) => {
    const filteredValues = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== ""));
    if (compositedImage) {
      filteredValues.image_url = compositedImage;
    }
    await onSubmit(filteredValues);
  };

  if (loadingCategories) return <div>Loading categories...</div>;
  if (errorCategories) return <div>{errorCategories}</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSaveProduct}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {/* Category Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
                Category
              </label>
              <Field
                as="select"
                name="category_id"
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCategoryChange(e, setFieldValue)}
                value={selectedCategoryId}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category_id" component="div" className="text-red-500 text-xs italic" />
              <div className="my-1 text-xs">
                <p>Text Generation {remainingTextGen} point remaining</p>
                {remainingTextGen === 0 && cooldownTextGen && (
                  <p>Next reset in: {Math.ceil(cooldownTextGen / 60000)} minutes</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleGenerateSuggestions}
                className="py-1 px-3 border-[1px] mt-2 border-dspGreen rounded-lg text-dspGreen font-bold text-xs hover:scale-105 hover:text-dspDarkGreen transition-all duration-300"
                disabled={!selectedCategoryId} 
              >
                Generate Food Name Suggestions
              </button>
            </div>

            {/* Food Name Suggestions */}
            <div className="mb-4">
              {loadingSuggestions ? (
                <div>Loading suggestions...</div>
              ) : errorSuggestions ? (
                <div>{errorSuggestions}</div>
              ) : (
                suggestions.length > 0 && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Food Name Suggestions
                    </label>
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>

            {/* Food Name Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="food_name">
                Food Name
              </label>
              <Field name="food_name" type="text" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
              <ErrorMessage name="food_name" component="div" className="text-red-500 text-xs italic" />
            </div>

            {/* Price Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <Field name="price" type="number" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
              <ErrorMessage name="price" component="div" className="text-red-500 text-xs italic" />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">
                Image Upload
              </label>
              <input
                name="image_url"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    setFieldValue("image_url", file);
                    setImageFile(file);
                  }
                }}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              />
              <ErrorMessage name="image_url" component="div" className="text-red-500 text-xs italic" />
            </div>

            {/* Background Command */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="backgroundCommand">
                Background Command
              </label>
              <input
                type="text"
                id="backgroundCommand"
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                value={backgroundCommand}
                onChange={(e) => setBackgroundCommand(e.target.value)}
              />
              <p className="text-xs text-red-500">Provide a <strong>specific</strong> prompt for the background image</p>
              <div className="mt-y text-xs">
                <p>Background Removal {remainingBgRemoval} point remaining</p>
                {remainingBgRemoval === 0 && cooldownBgRemoval && (
                  <p>Next reset in: {Math.ceil(cooldownBgRemoval / 60000)} minutes</p>
                )}
                <p>Image Generation {remainingImageGen} point remaining</p>
                {remainingImageGen === 0 && cooldownImageGen && (
                  <p className="text-xl text-black">Next reset in: {Math.ceil(cooldownImageGen / 60000)} minutes</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={handleBackgroundChange}
                className="border-[1px] border-dspGreen rounded-lg text-dspGreen font-bold py-1 px-3 hover:scale-105 hover:text-dspDarkGreen transition-all duration-300"
              >
                {loadingBackground ? "Generating..." : "Generate Background"}
              </button>
            </div>

            {compositedImage && (
              <div className="mb-6">
                <p className="text-gray-700 text-sm font-bold mb-2">Generated Composite Preview:</p>
                <img src={compositedImage} alt="Composite preview" className="w-full h-auto rounded shadow-md" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-dspGreen hover:bg-dspDarkGreen text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default FormProduct;